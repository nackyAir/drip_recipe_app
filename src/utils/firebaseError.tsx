type Props = {
  [key: string]: string
}

export const firebaseError: Props = {
  'auth/invalid-email': 'メールアドレスの形式が間違っています。',
  'auth/user-disabled': 'ユーザーは無効になっています。',
  'auth/user-not-found': 'ユーザーが存在しません。',
  'auth/invalid-login-credentials':
    'メールアドレスまたはパスワードが間違っています。',
  'auth/email-already-in-use': 'このメールアドレスは既に使用されています。',
  'auth/missing-password': 'パスワードが間違っています。',
  'auth/wrong-password': 'パスワードが間違っています。',
  'auth/too-many-requests':
    '何度もパスワードを間違えたため、一時的に機能が制限されています。',
  'auth/weak-password': 'パスワードは6文字以上で入力してください。',
}
