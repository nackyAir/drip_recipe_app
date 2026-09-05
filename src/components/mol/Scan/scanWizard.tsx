'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { FiCamera, FiRefreshCw } from 'react-icons/fi'
import { toast } from 'react-toastify'

import { Button, SimpleGrid, TextInput } from '@mantine/core'

import { createRecipe } from '~/actions/recipes'
import { extractBeanProfile } from '~/actions/scan'
import { compressImageFile } from '~/lib/compress-image'
import { SuggestedRecipe, suggestRecipe } from '~/lib/recipe-engine'
import { BeanProfile } from '~/types'

const emptyProfile = (): BeanProfile => ({
  beansName: '',
  origin: '',
  variety: '',
  process: '',
  elevation: '',
  roast: '',
  taste: '',
})

type Step = 'capture' | 'profile' | 'recipe'

export const ScanWizard = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('capture')
  const [previewUrl, setPreviewUrl] = useState('')
  const [profile, setProfile] = useState<BeanProfile>(emptyProfile())
  const [suggestion, setSuggestion] = useState<SuggestedRecipe | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [saving, setSaving] = useState(false)

  const canPropose = useMemo(
    () =>
      Boolean(
        profile.beansName.trim() ||
          profile.origin.trim() ||
          profile.process.trim() ||
          profile.taste.trim(),
      ),
    [profile],
  )

  const resetScan = () => {
    setStep('capture')
    setPreviewUrl('')
    setProfile(emptyProfile())
    setSuggestion(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const onSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setExtracting(true)

    try {
      const compressed = await compressImageFile(file)
      const result = await extractBeanProfile(compressed)

      if (result.error) {
        toast.info(result.error, {
          theme: 'light',
          position: 'top-center',
          autoClose: 4000,
        })
        setProfile(emptyProfile())
      } else if (result.profile) {
        setProfile(result.profile)
        toast.success('ラベルから豆の情報を読み取りました。内容を確認してください', {
          theme: 'light',
          position: 'top-center',
          autoClose: 2500,
        })
      }

      setStep('profile')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '画像の処理に失敗しました', {
        theme: 'light',
        position: 'top-center',
        autoClose: 3000,
      })
    } finally {
      setExtracting(false)
    }
  }

  const updateProfile =
    (field: keyof BeanProfile) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value
      setProfile((current) => ({ ...current, [field]: value }))
    }

  const onPropose = () => {
    const next = suggestRecipe(profile)
    setSuggestion(next)
    setStep('recipe')
  }

  const onSave = async () => {
    if (!suggestion) return

    if (process.env.NEXT_PUBLIC_UI_PREVIEW === 'true') {
      toast.info('プレビューでは保存できません。ログイン後に保存できます。', {
        theme: 'light',
        position: 'top-center',
        autoClose: 3000,
      })
      return
    }

    setSaving(true)

    try {
      const result = await createRecipe(suggestion.recipe)
      if (result.error) {
        toast.error(result.error, {
          theme: 'light',
          position: 'top-center',
          autoClose: 2500,
        })
        return
      }

      toast.success('レシピを保存しました', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2000,
      })
      router.push('/user')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存に失敗しました', {
        theme: 'light',
        position: 'top-center',
        autoClose: 2500,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="scan-wizard">
      <ol className="scan-steps" aria-label="スキャン手順">
        <li className={step === 'capture' ? 'is-active' : ''}>1. 撮影</li>
        <li className={step === 'profile' ? 'is-active' : ''}>2. プロフィール</li>
        <li className={step === 'recipe' ? 'is-active' : ''}>3. レシピ</li>
      </ol>

      {step === 'capture' && (
        <section className="scan-panel">
          <button
            type="button"
            className="scan-dropzone"
            onClick={() => inputRef.current?.click()}
            disabled={extracting}
          >
            <FiCamera size={28} aria-hidden />
            <strong>{extracting ? 'ラベルを読み取っています…' : '豆の袋を撮影する'}</strong>
            <span>カメラ、または保存済みの写真から選べます</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={onSelectFile}
          />
          <p className="scan-hint">
            APIキーがない場合でも、次の画面で産地・品種・プロセスを手入力してレシピを提案できます。
          </p>
          <Button
            variant="subtle"
            onClick={() => setStep('profile')}
            disabled={extracting}
          >
            写真なしで手入力する
          </Button>
        </section>
      )}

      {step === 'profile' && (
        <section className="scan-panel">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="選択した豆袋" className="scan-preview" />
          )}
          <h3 className="form-section-title">豆のプロフィール</h3>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <TextInput
              label="豆の名前"
              value={profile.beansName}
              onChange={updateProfile('beansName')}
              placeholder="Ethiopia Yirgacheffe"
            />
            <TextInput
              label="産地"
              value={profile.origin}
              onChange={updateProfile('origin')}
              placeholder="エチオピア"
            />
            <TextInput
              label="品種"
              value={profile.variety}
              onChange={updateProfile('variety')}
              placeholder="Heirloom"
            />
            <TextInput
              label="精製"
              value={profile.process}
              onChange={updateProfile('process')}
              placeholder="Washed"
            />
            <TextInput
              label="標高"
              value={profile.elevation}
              onChange={updateProfile('elevation')}
              placeholder="1900m"
            />
            <TextInput
              label="焙煎"
              value={profile.roast}
              onChange={updateProfile('roast')}
              placeholder="浅煎り"
            />
          </SimpleGrid>
          <TextInput
            mt="sm"
            label="テイスト"
            value={profile.taste}
            onChange={updateProfile('taste')}
            placeholder="柑橘、ジャスミン"
          />
          <div className="scan-actions">
            <Button variant="subtle" color="gray" onClick={resetScan}>
              撮り直す
            </Button>
            <Button onClick={onPropose} disabled={!canPropose}>
              レシピを提案
            </Button>
          </div>
        </section>
      )}

      {step === 'recipe' && suggestion && (
        <section className="scan-panel">
          <h3 className="recipe-name">{suggestion.recipe.name}</h3>
          <p className="recipe-beans">
            {suggestion.recipe.beansName}
            {suggestion.recipe.origin ? ` · ${suggestion.recipe.origin}` : ''}
            {suggestion.recipe.variety ? ` · ${suggestion.recipe.variety}` : ''}
          </p>
          <p className="taste-note">味わい：{suggestion.recipe.taste}</p>
          <div className="spec-grid">
            {[
              ['焙煎', suggestion.recipe.roast],
              ['精製', suggestion.recipe.process],
              ['粒度', suggestion.recipe.mesh],
              ['湯温', suggestion.recipe.temp],
              ['標高', suggestion.recipe.elevation],
            ].map(([label, value]) => (
              <div className="spec-item" key={label}>
                <span className="spec-label">{label}</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="pour-head">
            <span>注湯スケジュール · 豆 15g / 湯 250g</span>
            <span>{suggestion.recipe.brewTime.length}投</span>
          </div>
          <div className="pour-list">
            {suggestion.recipe.brewTime.map((item, index) => (
              <div className="pour-step" key={item.key}>
                <span className="pour-index">{index + 1}</span>
                <span className="pour-time">{item.time}</span>
                <span className="pour-gram">{item.gram}</span>
              </div>
            ))}
          </div>
          {suggestion.reasons.length > 0 && (
            <ul className="scan-reasons">
              {suggestion.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
          <div className="scan-actions">
            <Button
              variant="subtle"
              color="gray"
              leftIcon={<FiRefreshCw />}
              onClick={() => setStep('profile')}
            >
              プロフィールを直す
            </Button>
            <Button loading={saving} onClick={onSave}>
              このレシピを保存
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
