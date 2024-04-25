import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useIssues } from '@/api/platform/issues/useIssues';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { RadioButton } from '@/common/components/buttons/radio/radio-button';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import typography from '@/common/styles/typography';
import { Issue, IssueType } from '@appjusto/types';
import { useState } from 'react';
import { Modal, ModalProps, Pressable, View } from 'react-native';

interface Props extends ModalProps {
  title: string;
  issueType: IssueType | null;
  loading?: boolean;
  onConfirm: (issue: Issue, comment: string) => void;
  onDismiss: () => void;
}
export const SelectIssueModal = ({
  title,
  issueType,
  loading,
  onConfirm,
  onDismiss,
  visible,
  ...props
}: Props) => {
  // state
  const [selectedIssue, setSelectedIssue] = useState<Issue>();
  const issues = useIssues(issueType);
  const [comment, setComment] = useState('');
  // tracking
  useTrackScreenView('Relatar Problema', { issueType }, visible);
  // UI
  if (!visible) return null;
  return (
    <Modal transparent animationType="slide" visible={visible} {...props}>
      {issues ? (
        <DefaultKeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            <Pressable style={{ flex: 1 }} onPress={onDismiss} />
            <View style={{ flex: 0.8, padding: paddings.lg, backgroundColor: colors.white }}>
              <ModalHandle style={{ marginTop: paddings.xl }} />
              <DefaultText style={{ marginTop: paddings.xl }} size="lg">
                {title}
              </DefaultText>
              {/* issues */}
              <View style={{ marginTop: paddings.lg }}>
                {issues.map((issue) => (
                  <Pressable key={issue.id}>
                    <View style={{ marginTop: paddings.xl }}>
                      <RadioButton
                        // @ts-ignore
                        textStyle={{ ...typography.sm }}
                        title={issue.title}
                        checked={selectedIssue?.id === issue.id}
                        onPress={() => {
                          setSelectedIssue(issue);
                        }}
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
              {/* comment */}
              <View style={{ marginTop: paddings.lg }}>
                <DefaultText style={{ marginTop: paddings.lg }} color="black">
                  Quer acrescentar algum comentário?
                </DefaultText>
                <DefaultInput
                  inputStyle={{ textAlignVertical: 'top', minHeight: 70 }}
                  placeholder="Escreva sua mensagem"
                  value={comment}
                  multiline
                  onChangeText={setComment}
                />
              </View>
              <View style={{ flex: 1 }} />
              <DefaultButton
                style={{ marginVertical: paddings.lg }}
                title="Enviar"
                disabled={!selectedIssue || loading}
                loading={loading}
                onPress={() => {
                  if (selectedIssue) onConfirm(selectedIssue, comment);
                }}
              />
            </View>
          </View>
        </DefaultKeyboardAwareScrollView>
      ) : (
        <Loading />
      )}
    </Modal>
  );
};
