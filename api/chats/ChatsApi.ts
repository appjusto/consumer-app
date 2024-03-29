import { documentsAs } from '@/common/firebase/documentAs';
import { serverTimestamp } from '@/common/firebase/serverTimestamp';
import { ChatMessage, WithId } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import AuthApi from '../auth/AuthApi';

const chatsRef = () => firestore().collection('chats');
const chatRef = (id: string) => chatsRef().doc(id);

export default class ChatsApi {
  constructor(private auth: AuthApi) {}

  observeOrderChat(orderId: string, resultHandler: (chats: WithId<ChatMessage>[]) => void) {
    const query = chatsRef()
      .where('orderId', '==', orderId)
      .where('participantsIds', 'array-contains', this.auth.getUserId())
      .orderBy('timestamp', 'asc');
    return query.onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          resultHandler([]);
        } else {
          resultHandler(documentsAs<ChatMessage>(snapshot.docs));
        }
      },
      (error) => {
        console.error(error);
        crashlytics().recordError(error);
      }
    );
  }

  async sendMessage(message: Partial<ChatMessage>) {
    console.log(message);
    await chatsRef().add({
      ...message,
      read: false,
      timestamp: serverTimestamp(),
    } as ChatMessage);
  }

  async updateReadMessages(messageIds: string[]) {
    const batch = firestore().batch();
    messageIds.forEach((id) => {
      batch.update(chatRef(id), {
        read: true,
      } as Partial<ChatMessage>);
    });
    await batch.commit();
  }
}
