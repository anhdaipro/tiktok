/**
 * Search Helper - Local data filtering utilities
 * Provides generic search functionality for arrays of any data type
 */

export interface SearchOptions {
  /** Search mode: 'contains' | 'exact' | 'startsWith' */
  mode?: 'contains' | 'exact' | 'startsWith'
  /** Case sensitive search */
  caseSensitive?: boolean
  /** Remove Vietnamese diacritics for search */
  removeDiacritics?: boolean
}

/**
 * Remove Vietnamese diacritics from text
 * @param text - Text to normalize
 * @returns Normalized text
 */
function removeDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

/**
 * Get nested property value from object using dot notation
 * @param obj - Object to get property from
 * @param path - Property path (e.g., 'user.profile.name')
 * @returns Property value or undefined
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

/**
 * Convert value to searchable string
 * @param value - Value to convert
 * @param options - Search options
 * @returns Searchable string
 */
function toSearchableString(value: any, options: SearchOptions): string {
  if (value === null || value === undefined) return ''

  let str = String(value)

  if (!options.caseSensitive) {
    str = str.toLowerCase()
  }

  if (options.removeDiacritics) {
    str = removeDiacritics(str)
  }

  return str.trim()
}

/**
 * Check if search term matches value based on search mode
 * @param value - Value to check
 * @param searchTerm - Search term
 * @param options - Search options
 * @returns Whether value matches search term
 */
function matchesSearchTerm(value: string, searchTerm: string, options: SearchOptions): boolean {
  switch (options.mode) {
    case 'exact':
      return value === searchTerm
    case 'startsWith':
      return value.startsWith(searchTerm)
    case 'contains':
    default:
      return value.includes(searchTerm)
  }
}

/**
 * Search local data array with flexible field matching
 * @param data - Array of data to search
 * @param searchTerm - Search term
 * @param searchFields - Fields to search in (supports nested properties)
 * @param options - Search options
 * @returns Filtered array matching search criteria
 *
 * @example
 * ```typescript
 * // Basic usage
 * const users = [
 *   { name: 'John Doe', email: 'john@example.com' },
 *   { name: 'Jane Smith', email: 'jane@example.com' }
 * ]
 * const filtered = searchLocalData(users, 'john', ['name', 'email'])
 *
 * // Nested properties
 * const products = [
 *   { title: 'Laptop', category: { name: 'Electronics' } },
 *   { title: 'Phone', category: { name: 'Electronics' } }
 * ]
 * const filtered = searchLocalData(products, 'electronics', ['title', 'category.name'])
 *
 * // With options
 * const filtered = searchLocalData(data, 'search', ['name'], {
 *   mode: 'startsWith',
 *   caseSensitive: false,
 *   removeDiacritics: true
 * })
 * ```
 */
export function searchLocalData<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T | string)[],
  options: SearchOptions = {}
): T[] {
  // Set default options
  const searchOptions: SearchOptions = {
    mode: 'contains',
    caseSensitive: false,
    removeDiacritics: true,
    ...options
  }

  // Return all data if search term is empty
  if (!searchTerm || !searchTerm.trim()) {
    return data
  }

  // Prepare search term
  const normalizedSearchTerm = toSearchableString(searchTerm, searchOptions)

  // Filter data
  return data.filter(item => {
    // Check if any field matches the search term
    return searchFields.some(field => {
      const fieldPath = String(field)
      let fieldValue: any

      // Handle nested properties
      if (fieldPath.includes('.')) {
        fieldValue = getNestedValue(item, fieldPath)
      } else {
        fieldValue = (item as any)[field]
      }

      // Handle array fields
      if (Array.isArray(fieldValue)) {
        return fieldValue.some(arrayItem => {
          const searchableValue = toSearchableString(arrayItem, searchOptions)
          return matchesSearchTerm(searchableValue, normalizedSearchTerm, searchOptions)
        })
      }

      // Handle regular fields
      const searchableValue = toSearchableString(fieldValue, searchOptions)
      return matchesSearchTerm(searchableValue, normalizedSearchTerm, searchOptions)
    })
  })
}

/**
 * Multi-term search with AND logic
 * All terms must match for item to be included
 * @param data - Array of data to search
 * @param searchTerms - Array of search terms
 * @param searchFields - Fields to search in
 * @param options - Search options
 * @returns Filtered array
 */
export function searchLocalDataMultiTerm<T>(
  data: T[],
  searchTerms: string[],
  searchFields: (keyof T | string)[],
  options: SearchOptions = {}
): T[] {
  if (!searchTerms.length) return data

  return searchTerms.reduce((filteredData, term) => {
    return searchLocalData(filteredData, term, searchFields, options)
  }, data)
}

/**
 * Search with highlights - returns matched items with highlighted text
 * @param data - Array of data to search
 * @param searchTerm - Search term
 * @param searchFields - Fields to search in
 * @param options - Search options
 * @returns Array with matched items and highlight info
 */
export function searchLocalDataWithHighlight<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T | string)[],
  options: SearchOptions = {}
): Array<{
  item: T
  matchedFields: string[]
  highlights: Record<string, string>
}> {
  const filteredData = searchLocalData(data, searchTerm, searchFields, options)
  const normalizedSearchTerm = toSearchableString(searchTerm, options)

  return filteredData.map(item => {
    const matchedFields: string[] = []
    const highlights: Record<string, string> = {}

    searchFields.forEach(field => {
      const fieldPath = String(field)
      let fieldValue: any

      if (fieldPath.includes('.')) {
        fieldValue = getNestedValue(item, fieldPath)
      } else {
        fieldValue = (item as any)[field]
      }

      const searchableValue = toSearchableString(fieldValue, options)

      if (matchesSearchTerm(searchableValue, normalizedSearchTerm, options)) {
        matchedFields.push(fieldPath)

        // Create highlighted version
        const originalValue = String(fieldValue || '')
        if (!options.caseSensitive) {
          const regex = new RegExp(`(${searchTerm})`, 'gi')
          highlights[fieldPath] = originalValue.replace(regex, '<mark>$1</mark>')
        } else {
          const regex = new RegExp(`(${searchTerm})`, 'g')
          highlights[fieldPath] = originalValue.replace(regex, '<mark>$1</mark>')
        }
      }
    })

    return {
      item,
      matchedFields,
      highlights
    }
  })
}