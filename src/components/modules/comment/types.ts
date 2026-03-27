export interface CommentBaseProps {
  refId: string

  afterSubmit?: () => void
  autoFocus?: boolean
  compact?: boolean
  initialValue?: string
}
