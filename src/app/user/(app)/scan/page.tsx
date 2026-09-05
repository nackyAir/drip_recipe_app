import { ScanWizard } from '~/components/mol/Scan/scanWizard'

export default function ScanPage() {
  return (
    <>
      <div className="page-hero">
        <div>
          <p className="page-kicker">SCAN</p>
          <h1 className="page-title">豆をスキャン</h1>
          <p className="page-lead">
            袋のラベルから産地・品種・プロセス・標高・テイストを読み取り、ドリップレシピを提案します。
          </p>
        </div>
      </div>
      <ScanWizard />
    </>
  )
}
