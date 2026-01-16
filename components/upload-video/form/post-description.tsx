import { triggersConfig } from '@/components/comment/popup-comment-input';
import FlexBox from '@/components/common/flex-box';
import { SuggestionList } from '@/components/common/suggestion-list';
import { useTheme } from '@/contexts/theme-context';
import { useUploadStore } from '@/stores/upload-store';
import { AtSign, Expand, Hash, Pencil, Play } from 'lucide-react-native';
import React, { useMemo, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMentions } from 'react-native-controlled-mentions';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
interface Props {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
    onAppendText: (text: string) => void;
    openPreview: () => void;
}
const PostDescription = ({ 
    isExpanded, 
    setIsExpanded, 
    onAppendText, 
    openPreview, 
}: Props) =>{
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { type, textToImage, textStyle, mediaUri, thumbUri } = useUploadStore();
  const {control} = useFormContext();
  const inputRef = useRef<TextInput>(null);
  const {
    field: { value, onChange },
    } = useController({
      name: "caption",
      control,
  });
  const { textInputProps, triggers } = useMentions({
      value,
      onChange,
      triggersConfig
  });
  const size = useSharedValue(isExpanded ? 40 : 100);
  const heightInput = useSharedValue(isExpanded ? 200 : 60);

  const stylThumb = useAnimatedStyle(() => {
    return {
      width: size.value,
      height: size.value,
    };
  });

  const styleInput = useAnimatedStyle(() => {
    return {
      height: heightInput.value,
    };
  });

  React.useEffect(() => {
    size.value = 
      withTiming(isExpanded ? 40 : 100, { duration: 200, easing: Easing.inOut(Easing.ease) });
    heightInput.value = 
      withTiming(isExpanded ? 200 : 60, { duration: 200, easing: Easing.inOut(Easing.ease) });
  }, [isExpanded]);

  return (
    <View style={styles.topSection}>
        <TouchableOpacity onPress={openPreview} style={{alignSelf: 'flex-start'}}>
          <Animated.View style={[styles.thumbnail, stylThumb, type === 'text' && { backgroundColor: textStyle?.bg }]}>
            {type === 'text' ? (
                <Text style={[styles.thumbnailText, { color: textStyle?.color }]}>
                    {textToImage }
                </Text>
            ) : (
                <>
                  <Image source={{ uri: type == 'video' ? thumbUri : `file://${mediaUri}` }} style={[{ width: '100%', height: '100%'}, { borderRadius: 4 }]} resizeMode="cover" />
                  
                  {type === 'video' && (
                    <View style={styles.playIconOverlay}>
                        <Play size={24} color="white" fill="white" />
                    </View>
                  )}
                </>
            )}
            
            <View style={styles.thumbnailBadge}>
                <Text style={styles.thumbnailBadgeText}>Ảnh bìa</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
        

        {/* Description Input with Mentions */}
        <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Thêm tiêu đề hấp dẫn</Text>
            <View style={styles.divider} />
            <AnimatedTextInput
                {...textInputProps}
                ref={inputRef}
                placeholder="Mô tả dài có thể giúp tăng lượt xem trung bình lên gấp 3 lần."
                placeholderTextColor={colors.textSecondary}
                style={[styles.descriptionInput,styleInput]}
                onFocus={() => {
                    console.log("Focused!");
                    setIsExpanded(true);
                }}
                multiline // Enable multiline input
            />
            
            {/* Toolbar */}
            <FlexBox direction="row" gap={16} align="center" justify='space-between' style={styles.toolbar}>
              <FlexBox direction="row" gap={8}>
                <TouchableOpacity style={styles.toolBtn} onPress={() => onAppendText('#')}>
                    <Hash size={18} color={colors.text} />

                </TouchableOpacity>
                <TouchableOpacity style={styles.toolBtn} onPress={() => onAppendText('@')}>
                    <AtSign size={18} color={colors.text} />
                    
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolBtn}>
                    <Pencil size={18} color={colors.text} />

                </TouchableOpacity>
              </FlexBox>
              <FlexBox direction="row" gap={4}>
                <TouchableOpacity style={styles.toolBtn} onPress={() => setIsExpanded(!isExpanded)}>
                    <Expand size={18} color={colors.text} />
                </TouchableOpacity>
              </FlexBox>
            </FlexBox>
        </View>
        <SuggestionList {...triggers.mention} saveUsers={user => console.log(user)}  trigger="mention" />
        <SuggestionList {...triggers.hashtag} saveUsers={user => console.log(user)}  trigger="hashtag" />
    </View>
  );
}
export default PostDescription

const createStyles = (colors: any) => StyleSheet.create({
  topSection: { 
    padding: 16, 
    gap: 12 
  },
  thumbnail: { 
    borderRadius: 4, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative' 
  },
  thumbnailText: { 
    fontSize: 16, fontWeight: 'bold' },
  thumbnailBadge: { position: 
    'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 2, 
    alignItems: 'center' },
  thumbnailBadgeText: { color: '#fff', fontSize: 10 },
  playIconOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.2)' 
  },
  descriptionLabel: { 
    fontSize: 15, 
    color: colors.text, 
    marginBottom: 8 
  },
  descriptionContainer: { 
    minHeight: 100 
  },
  descriptionInput: { 
    fontSize: 15, 
    color: colors.text, 
    width: '100%',
    minHeight: 80, 
    textAlignVertical: 'top' ,
    flex:1
  },
  divider: { height: 1, backgroundColor: colors.border },
  toolbar: { marginTop: 8, marginBottom: 16 },
  toolBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.surface, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4, 
    gap: 4 
  },
});
