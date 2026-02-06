import { useState } from 'react';
import { Popover, Dialog, Transition } from '@headlessui/react';
import {
  PencilSimpleIcon,
  LockIcon,
  CalendarBlankIcon,
  SignOutIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import './IdentitySection.css';

type Props = {
  displayName: string;
  email: string;
  bio: string;
  dateOfBirth?: string;
  onSave: (
    data: Partial<{
      displayName: string;
      bio: string;
      dateOfBirth: string;
    }>
  ) => void;
  onLogout: () => void;
};

type EditingField = 'name' | 'bio' | 'dob' | null;

export default function IdentitySection({
  displayName,
  email,
  bio,
  dateOfBirth,
  onSave,
  onLogout,
}: Props) {
  const [editingField, setEditingField] = useState<EditingField>(null);

  const [nameDraft, setNameDraft] = useState(displayName.toLowerCase());
  const [bioDraft, setBioDraft] = useState(bio.toLowerCase());
  const [dobDraft, setDobDraft] = useState(dateOfBirth ?? '');

  const isNameDirty = nameDraft !== displayName.toLowerCase();
  const isBioDirty = bioDraft !== bio.toLowerCase();
  const isDobDirty = dobDraft !== (dateOfBirth ?? '');

  const formattedDob = dateOfBirth
    ? new Date(dateOfBirth).toLocaleDateString()
    : '';

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  return (
    <>
      <section className="identity-section">
        {/* Email */}
        <div className="field-row locked">
          <label>Email</label>
          <div className="value-row">
            <span>{email}</span>
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
                onChange={e => setNameDraft(e.target.value.toLowerCase())}
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

        {/* Date of Birth */}
        <div className="field-row">
          <label>Date of Birth</label>

          <Popover className="dob-wrapper">
            <Popover.Button className="dob-display">
              <input
                readOnly
                value={formattedDob}
                placeholder="Select a date"
              />
              <CalendarBlankIcon size={16} />
            </Popover.Button>

            <Popover.Panel className="dob-panel">
              <input
                type="date"
                value={dobDraft}
                onChange={e => setDobDraft(e.target.value)}
                autoFocus
              />

              {isDobDirty && (
                <button
                  className="save-btn"
                  onClick={() => {
                    onSave({ dateOfBirth: dobDraft });
                    setEditingField(null);
                  }}
                >
                  Save
                </button>
              )}
            </Popover.Panel>
          </Popover>
        </div>

        {/* Bio */}
        <div className="field-row">
          <label>What should Lyfie AI know about you?</label>

          {editingField === 'bio' ? (
            <div className="bio-edit-block">
              <textarea
                value={bioDraft}
                maxLength={500}
                onChange={e => setBioDraft(e.target.value.toLowerCase())}
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

        {/* Logout */}
        <div className="logout-row">
          <button
            className="logout-btn"
            onClick={() => setConfirmLogoutOpen(true)}
          >
            <SignOutIcon size={18} />
            <span>Log out</span>
          </button>
        </div>
      </section>
      
      {/* Logout Confirmation Modal */}
      <Transition appear show={confirmLogoutOpen} as="div">
        <Dialog
          as="div"
          className="logout-dialog-root"
          onClose={() => setConfirmLogoutOpen(false)}
        >
          <div className="logout-backdrop" />

          <div className="logout-dialog-wrapper">
            <Dialog.Panel className="logout-dialog">
              <WarningCircleIcon size={28} className="logout-icon" />

              <Dialog.Title className="logout-title">
                Log out of Lyfie?
              </Dialog.Title>

              <Dialog.Description className="logout-description">
                You’ll need to sign in again to access your dashboard.
              </Dialog.Description>

              <div className="logout-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setConfirmLogoutOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn-danger"
                  onClick={onLogout}
                >
                  Log out
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
