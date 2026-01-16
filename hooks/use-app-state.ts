import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState(onChange: (state: AppStateStatus) => void) {
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const sub = AppState.addEventListener('change', nextState => {
            appState.current = nextState;
            onChange(nextState);
        });

        return () => sub.remove();
    }, []);
}
