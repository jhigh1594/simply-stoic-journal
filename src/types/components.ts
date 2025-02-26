export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void | Promise<void>;
}

export interface CardProps {
  onUpdate: () => void | Promise<void>;
  isExpanded?: boolean;
  onToggle?: () => void;
}