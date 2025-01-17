import {HelpCircleIcon} from '@sanity/icons'
import {Badge, Button, Card, Inline, Popover, Stack, Text, useClickOutsideEvent} from '@sanity/ui'
import {useCallback, useRef, useState} from 'react'
import {useTranslation} from 'sanity'

import {visionLocaleNamespace} from '../i18n'
import {PerspectivePopoverContent, PerspectivePopoverLink} from './PerspectivePopover.styled'

export function PerspectivePopover() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const handleClick = useCallback(() => setOpen((o) => !o), [])

  const {t} = useTranslation(visionLocaleNamespace)

  useClickOutsideEvent(
    () => setOpen(false),
    () => [buttonRef.current, popoverRef.current],
  )

  return (
    <Popover
      content={
        <PerspectivePopoverContent>
          <Stack space={4}>
            <Inline space={2}>
              <Text weight="medium">{t('settings.perspectives.title')}</Text>
              <Badge tone="primary">{t('label.new')}</Badge>
            </Inline>

            <Card>
              <Text muted>{t('settings.perspectives.description')}</Text>
            </Card>

            <Card>
              <Text>
                <PerspectivePopoverLink href="https://sanity.io/docs/perspectives" target="_blank">
                  {t('settings.perspectives.action.docs-link')} &rarr;
                </PerspectivePopoverLink>
              </Text>
            </Card>
          </Stack>
        </PerspectivePopoverContent>
      }
      placement="bottom-start"
      portal
      padding={3}
      ref={popoverRef}
      open={open}
    >
      <Button
        icon={HelpCircleIcon}
        mode="bleed"
        padding={2}
        tone="primary"
        fontSize={1}
        ref={buttonRef}
        onClick={handleClick}
        selected={open}
      />
    </Popover>
  )
}
