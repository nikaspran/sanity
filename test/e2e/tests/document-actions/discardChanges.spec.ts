import {expect} from '@playwright/test'
import {test} from '@sanity/test'

test(`isn't possible to discard changes if a changed document has no published version`, async ({
  page,
  createDraftDocument,
}) => {
  await createDraftDocument('/test/content/book')

  const titleInput = page.getByTestId('field-title').getByTestId('string-input')
  const actionMenuButton = page.getByTestId('action-menu-button')
  const discardChangesButton = page.getByTestId('action-Discardchanges')
  const deleteButton = page.getByTestId('action-Delete')

  await titleInput.fill('This is a book')

  await actionMenuButton.click()
  await expect(deleteButton).toBeEnabled()
  await expect(discardChangesButton).toBeHidden()
})

test(`is possible to discard changes if a changed document has a published version`, async ({
  page,
  createDraftDocument,
}) => {
  await createDraftDocument('/test/content/book')

  const titleInput = page.getByTestId('field-title').getByTestId('string-input')
  const publishButton = page.getByTestId('action-publish')
  const actionMenuButton = page.getByTestId('action-menu-button')
  const discardChangesButton = page.getByTestId('action-Discardchanges')

  await titleInput.fill('This is a book')

  // Wait for the document to be published.
  await page.waitForTimeout(1_000)
  await publishButton.click()
  await expect(page.getByTestId('pane-footer-document-status')).toContainText('Published just now')

  await titleInput.fill('This is not a book')

  await actionMenuButton.click()
  await expect(discardChangesButton).toBeEnabled()
})

test(`displays the published document state after discarding changes`, async ({
  page,
  createDraftDocument,
}) => {
  await createDraftDocument('/test/content/book')

  const titleInput = page.getByTestId('field-title').getByTestId('string-input')
  const publishButton = page.getByTestId('action-publish')
  const actionMenuButton = page.getByTestId('action-menu-button')
  const discardChangesButton = page.getByTestId('action-Discardchanges')
  const confirmButton = page.getByTestId('confirm-dialog-confirm-button')

  await titleInput.fill('This is a book')

  // Wait for the document to be published.
  await page.waitForTimeout(1_000)
  await publishButton.click()
  await expect(page.getByTestId('pane-footer-document-status')).toContainText('Published just now')

  // Change the title.
  await titleInput.fill('This is not a book')

  // Discard the change.
  await actionMenuButton.click()
  await discardChangesButton.click()
  await expect(confirmButton).toBeVisible()
  await confirmButton.click()

  // Ensure the initial title is displayed.
  await expect(titleInput).toHaveValue('This is a book')
})
