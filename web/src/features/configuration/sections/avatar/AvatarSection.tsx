import { Menu } from '@headlessui/react';
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
      <Menu as="div" className="avatar-wrapper">
        <Menu.Button className="avatar-button">
          <img
            src={preview ?? currentAvatar}
            className="avatar-image"
          />
          <div className="avatar-overlay">Edit</div>
        </Menu.Button>

        <Menu.Items className="avatar-menu">
          <Menu.Item>
            {({ active }) => (
              <button
                className={active ? 'active' : ''}
                onClick={viewAvatar}
              >
                View image
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                className={active ? 'active' : ''}
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                className={`danger ${active ? 'active' : ''}`}
                onClick={deleteAvatar}
              >
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

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
