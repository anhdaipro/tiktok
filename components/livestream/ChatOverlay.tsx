import { useChat } from '@/hooks/useChat';
import { Send } from 'lucide-react-native';
import React from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ChatOverlayProps {
    roomId: string;
    userId: string;
    username: string;
    avatar: string;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({
    roomId,
    userId,
    username,
    avatar,
}) => {
    const [messageText, setMessageText] = React.useState('');
    const { messages, sendMessage } = useChat({ roomId, userId, username, avatar });

    const handleSend = () => {
        if (messageText.trim()) {
            sendMessage(messageText.trim());
            setMessageText('');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            {/* Messages List */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.messageBubble}>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.messageText}>{item.message}</Text>
                        </View>
                    </View>
                )}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                inverted
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Nhập tin nhắn..."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    multiline
                    maxLength={200}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                    disabled={!messageText.trim()}
                >
                    <Send size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 300,
        pointerEvents: 'box-none',
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 8,
        maxWidth: '80%',
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    messageBubble: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        padding: 8,
        flex: 1,
    },
    username: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    messageText: {
        color: '#FFF',
        fontSize: 14,
        lineHeight: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: '#FFF',
        fontSize: 14,
        maxHeight: 80,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF2D55',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
