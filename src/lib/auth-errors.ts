type AuthError = {
  code?: string | null
  message?: string | null
}

const errorMessages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'メールアドレスまたはパスワードが間違っています。',
  INVALID_PASSWORD: 'パスワードが間違っています。',
  USER_NOT_FOUND: 'ユーザーが存在しません。',
  FAILED_TO_CREATE_USER: 'ユーザーの作成に失敗しました。',
  USER_ALREADY_EXISTS: 'このメールアドレスは既に使用されています。',
  EMAIL_ALREADY_EXISTS: 'このメールアドレスは既に使用されています。',
  PASSWORD_TOO_SHORT: 'パスワードは8文字以上で入力してください。',
  INVALID_EMAIL: 'メールアドレスの形式が間違っています。',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'このアカウントは既に連携されています。',
}

export const getAuthErrorMessage = (error?: AuthError | null) => {
  if (!error) {
    return 'エラーが発生しました。'
  }

  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code]
  }

  return error.message || 'エラーが発生しました。'
}
