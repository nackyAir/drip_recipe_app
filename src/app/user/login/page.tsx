'use client'

import { Divider } from '@mantine/core'

import { GoogleButton } from '~/components/atm/Button/googleButon'
import { Logo } from '~/components/atm/Logo/logo'
import { UserRegisterForm } from '~/components/mol/Form/userRegisterForm'
import { useAuthContext } from '~/lib/auth-context'

const LoginPage = () => {
  const { GoogleWithLogin, loading } = useAuthContext()

  const onSubmit = async () => {
    await GoogleWithLogin()
  }

  return (
    <div className="login-stage">
      <section className="login-brand" aria-label="アプリの紹介">
        <Logo href="/user/login" />
        <div>
          <p className="page-kicker" style={{ color: '#e7c8ad' }}>
            FOR BARISTAS
          </p>
          <h1>抽出の再現性を、一冊のノートに。</h1>
          <p>
            豆のプロフィール、焙煎、粒度、湯温、注湯のタイミングまで。次に同じ味を出すための記録を、わかりやすく残します。
          </p>
          <div className="login-points">
            <div className="login-point">豆・焙煎・精製をカードで見比べる</div>
            <div className="login-point">湯温と粒度を抽出条件として残す</div>
            <div className="login-point">
              注湯の時間と累計グラムを手順で管理
            </div>
          </div>
        </div>
        <p>Coffee Recipe · ドリップレシピ帳</p>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <h2>ログイン</h2>
          <p className="lead">
            Google かメールアドレスで、レシピ帳を開きます。
          </p>
          <GoogleButton
            radius="md"
            size="md"
            fullWidth
            loading={loading}
            onClick={onSubmit}
          >
            Google で続ける
          </GoogleButton>
          <Divider
            label="またはメールアドレス"
            labelPosition="center"
            my="lg"
          />
          <UserRegisterForm />
        </div>
      </section>
    </div>
  )
}

export default LoginPage
