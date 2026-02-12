import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRef, useState } from 'react';
import './AvatarSection.css';

interface Props {
  avatarUrl: string;
}

const DEFAULT_AVATAR =
  'https://avatars.githubusercontent.com/u/41159815?v=4';

export default function AvatarSection({ avatarUrl }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentAvatar, setCurrentAvatar] = useState(avatarUrl);
  const [preview, setPreview] = useState<string | null>(null);

  function onSelectFile(file?: File) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function applyChange() {
    if (!preview) return;
    setCurrentAvatar(preview);
    setPreview(null);
  }

  function deleteAvatar() {
    setCurrentAvatar(DEFAULT_AVATAR);
    setPreview(null);
  }

  function viewAvatar() {
    window.open(currentAvatar, '_blank');
  }

  return (
    <section className="settings-avatar-section">
      <DropdownMenu.Root>
        <div className="avatar-wrapper">
          <DropdownMenu.Trigger asChild>
            <button type="button" className="avatar-button">
              <img
                src={preview ?? currentAvatar}
                className="avatar-image"
              />
              <div className="avatar-overlay">Edit</div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="avatar-menu" sideOffset={12} align="center">
            <DropdownMenu.Item className="avatar-menu-item" onSelect={viewAvatar}>
              View image
            </DropdownMenu.Item>

            <DropdownMenu.Item
              className="avatar-menu-item"
              onSelect={() => fileInputRef.current?.click()}
            >
              Change
            </DropdownMenu.Item>

            <DropdownMenu.Item className="avatar-menu-item danger" onSelect={deleteAvatar}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </div>
      </DropdownMenu.Root>

      {preview && (
        <div className="avatar-actions">
          <button className="primary" onClick={applyChange}>
            Save
          </button>
          <button className="ghost" onClick={() => setPreview(null)}>
            Cancel
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => onSelectFile(e.target.files?.[0])}
      />
    </section>
  );
}
