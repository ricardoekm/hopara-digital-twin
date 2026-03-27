import React, { useContext } from 'react'
import { CardListItem } from '@hopara/design-system/src/card-list/CardListItem'
import { i18n } from '@hopara/i18n'
import { useTheme } from '@hopara/design-system/src'
import { AuthContext } from '@hopara/auth-front/src/contexts/AuthContext'
import { PageType } from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import { DeleteDialogContainer } from './dialogs/DeleteDialogContainer'
import { RenameDialogContainer } from './dialogs/RenameDialogContainer'
import { DuplicateDialogContainer } from './dialogs/DuplicateDialogContainer'
import {Icon} from '@hopara/design-system/src/icons/Icon'

type Props = {
  id: string;
  name: string;
  imageUrl?: string;
  onDelete(): void;
  onRename(newName: string): void;
  onDuplicate(): void;
};

export const VisualizationCard = (props: Props) => {
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const theme = useTheme()

  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const [editOpen, setEditOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)

  const [duplicateOpen, setDuplicateOpen] = React.useState(false)
  const [isDuplicating, setIsDuplicating] = React.useState(false)

  const disabled = isEditing || isDeleting || isDuplicating

  return (
    <>
      <CardListItem
        hardLink
        name={props.name}
        href={pageNavigation.getUrl(PageType.VisualizationDetail, {visualizationId: props.id})}
        backgroundImage={props.imageUrl}
        icon={
          <div
            style={{
              color: theme.palette.spec.tonal.neutral[70],
              backgroundImage:
                'linear-gradient(to right, rgba(0,0,0,.05) 1px, transparent 1px)',
              width: '100%',
              height: '100%',
              backgroundSize: '10px, 10px',
              backgroundBlendMode: 'multiply',
              mixBlendMode: 'multiply',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Icon icon="placeholder" size="xl" />
          </div>
        }
        buttons={authContext.authorization.canEditVisualization() ? [
          {
            label: i18n('RENAME'),
            onClick: () => setEditOpen(true),
            disabled,
          },
          {
            label: i18n('DUPLICATE'),
            onClick: () => setDuplicateOpen(true),
            disabled,
          },
          {
            label: i18n('DELETE'),
            onClick: () => setDeleteOpen(true),
            disabled,
            color: 'error',
          },
        ] : []}
      />

      <DeleteDialogContainer
        id={props.id}
        name={props.name}
        onDelete={props.onDelete}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleteStatusChange={(deleting: boolean) => setIsDeleting(deleting)}
        isDeleting={isDeleting}
      />

      <RenameDialogContainer
        id={props.id}
        oldName={props.name}
        onSave={props.onRename}
        onClose={() => setEditOpen(false)}
        open={editOpen}
        onSaveStatusChange={(saving: boolean) => setIsEditing(saving)}
        isSaving={isEditing}
      />

      <DuplicateDialogContainer
        id={props.id}
        srcName={props.name}
        onDuplicate={props.onDuplicate}
        onClose={() => setDuplicateOpen(false)}
        open={duplicateOpen}
        onDuplicateStatusChange={(saving: boolean) => setIsDuplicating(saving)}
        isDuplicating={isDuplicating}
      />
    </>
  )
}
