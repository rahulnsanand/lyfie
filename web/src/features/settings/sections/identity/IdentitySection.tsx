import { useState } from 'react';
import { PencilSimpleIcon, LockIcon, FloppyDiskIcon } from '@phosphor-icons/react';
import './IdentitySection.css';

type Props = {
  displayName: string;
  email: string;
  bio: string;
  onSave: (data: Partial<{ displayName: string; bio: string }>) => void;
};

export default function IdentitySection({
  displayName,
  email,
  bio,
  onSave,
}: Props) {
  const [editingField, setEditingField] = useState<
    'name' | 'bio' | null
  >(null);

  const [nameDraft, setNameDraft] = useState(displayName);
  const [bioDraft, setBioDraft] = useState(bio);

  const isNameDirty = nameDraft !== displayName;
  const isBioDirty = bioDraft !== bio;

  return (
    <section className="identity-section">
      {/* Email (Locked) */}
      <div className="field-row locked">
        <label>Email</label>
        <div className="value-row">
          <span>rahulanand2206@gmail.com</span>
          <LockIcon size={14} />
        </div>
      </div>

      {/* Name */}
      <div className="field-row">
        <label>Name</label>

        {editingField === 'name' ? (
          <div className="edit-inline">
            <input
              value={nameDraft}
              onChange={e => setNameDraft(e.target.value)}
              autoFocus
            />
            {isNameDirty && (
              <button
                className="save-btn"
                onClick={() => {
                  onSave({ displayName: nameDraft });
                  setEditingField(null);
                }}
              >
                Save
              </button>
            )}
          </div>
        ) : (
          <div
            className="value-row editable"
            onClick={() => setEditingField('name')}
          >
            <span>{displayName}</span>
            <PencilSimpleIcon size={14} />
          </div>
        )}
      </div>

      {/* Bio */}
      <div className="field-row">
        <label>What should Lyfie AI know about you?</label>

        {editingField === 'bio' ? (
          <div className="edit-block">
            <textarea
              value={bioDraft}
              maxLength={500}
              onChange={e => setBioDraft(e.target.value)}
              autoFocus
            />
            <div className="bio-footer">
              <span>{bioDraft.length}/500</span>
              {isBioDirty && (
                <button
                  className="save-btn"
                  onClick={() => {
                    onSave({ bio: bioDraft });
                    setEditingField(null);
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className="value-row editable multiline"
            onClick={() => setEditingField('bio')}
          >
            <span>{bio || 'Add something about yourself…'}</span>
            <PencilSimpleIcon size={14} />
          </div>
        )}
      </div>
    </section>
  );
}
