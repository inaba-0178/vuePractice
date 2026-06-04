<template>
  <div class="car-detail-wrapper">
    <div v-if="loading" class="loading">読み込み中...</div>

    <template v-else-if="car">

      <!-- 車両名 -->
      <div class="car-detail__header">
        <h1 class="car-detail__title">{{ car.makerName }} {{ car.vehicleName }}</h1>
        <p class="car-detail__subtitle">{{ car.gradeName }}</p>
      </div>

      <!-- メインエリア：画像(7) + 価格(3) -->
      <div class="car-detail__main">

        <!-- 左：画像エリア -->
        <div class="car-detail__image-area">

          <!-- メイン画像 -->
          <div class="car-detail__main-image">
            <img
              v-if="currentImage"
              :src="imageBaseUrl + currentImage.imageUrl"
              :alt="`車両画像`"
            />
            <div v-else class="car-detail__no-image">NO IMAGE</div>
            <button
              v-if="filteredImages.length > 1"
              class="car-detail__image-prev"
              @click="prevImage"
            >‹</button>
            <button
              v-if="filteredImages.length > 1"
              class="car-detail__image-next"
              @click="nextImage"
            >›</button>
          </div>

          <!-- カテゴリフィルター -->
          <div class="car-detail__image-filter">
            <select v-model="imageCategory" class="car-detail__select">
              <option value="all">すべて</option>
              <option value="exterior">外装</option>
              <option value="interior">内装</option>
              <option value="engine">エンジン</option>
              <option value="other">その他</option>
            </select>
          </div>

          <!-- サムネイル一覧 -->
          <div class="car-detail__thumbnails-wrapper">
            <button
              class="car-detail__thumb-nav"
              :disabled="thumbPage === 0"
              @click="thumbPage = Math.max(0, thumbPage - 1)"
            >‹</button>

            <div class="car-detail__thumbnails">
              <div
                v-for="(img, idx) in thumbImages"
                :key="img.id"
                class="car-detail__thumbnail"
                :class="{ 'is-active': isCurrentThumb(idx) }"
                @click="selectImage(idx)"
              >
                <img v-if="img.imageUrl" :src="imageBaseUrl + img.imageUrl" :alt="`サムネイル${idx + 1}`" />
                <div v-else class="car-detail__thumbnail-noimg">NO IMAGE</div>
              </div>
            </div>

            <button
              class="car-detail__thumb-nav"
              :disabled="thumbPage >= totalThumbPages - 1"
              @click="thumbPage = Math.min(totalThumbPages - 1, thumbPage + 1)"
            >›</button>
          </div>
        </div>
        

        <!-- 右：価格・ボタンエリア -->
        <div class="car-detail__price-area">
          <div class="car-detail__price-block">

            <!-- 支払総額・車両本体価格 横並び -->
            <div class="car-detail__price-row">

              <!-- 支払総額 -->
              <div class="car-detail__price-item">
                <div class="car-detail__price-label">支払総額（税込）</div>
                <div class="car-detail__price">
                  {{ formatPrice(car.totalPrice ?? car.price) }}
                </div>
                <div class="car-detail__price-misc" v-if="car.miscFees">
                  （諸費用 {{ formatPrice(car.miscFees) }}含む）
                </div>
              </div>

              <div class="car-detail__price-divider"></div>

              <!-- 車両本体価格 -->
              <div class="car-detail__price-item">
                <div class="car-detail__price-label">車両本体価格（税込）</div>
                <div class="car-detail__price car-detail__price--base">
                  {{ formatPrice(car.priceWithTax ?? car.price) }}
                </div>
              </div>

            </div>

            <!-- ローン情報 -->
            <div class="car-detail__loan" v-if="loan">
              <div class="car-detail__loan-header">ローンご利用時</div>
              <div class="car-detail__loan-body">
                <div>
                  <span class="car-detail__loan-label">通常ローン 月々</span>
                  <span class="car-detail__loan-price">
                    {{ loan.monthly_payments.at(-1)?.amount.toLocaleString() }}円
                  </span>
                </div>
                <div>
                  <span class="car-detail__loan-label">実質金利</span>
                  <span class="car-detail__loan-rate-val">{{ loan.interest_rate }}%</span>
                </div>
              </div>
              <button class="car-detail__loan-detail-btn" @click="scrollToLoan">
                詳細を見る
              </button>
              <p class="car-detail__loan-note">※ローン条件は販売店にお問い合わせください</p>
            </div>
          </div>

          <div class="car-detail__actions">
            <button
              class="car-detail__fav-btn"
              :class="{ 'is-active': isFavorite }"
              @click="toggleFavorite"
            >
              {{ isFavorite ? '♥ お気に入り済み' : '♡ お気に入りに追加' }}
            </button>
            <button class="car-detail__inquiry-btn" @click="showInquiry = true">
              在庫確認・見積依頼
            </button>
          </div>

          <!-- 基本スペック簡易表示 -->
          <div class="car-detail__quick-specs">
            <div class="car-detail__quick-spec">
              <span class="car-detail__quick-spec-label">年式</span>
              <span class="car-detail__quick-spec-value">{{ car.modelYear ? `${car.modelYear}年` : '-' }}</span>
            </div>
            <div class="car-detail__quick-spec">
              <span class="car-detail__quick-spec-label">走行距離</span>
              <span class="car-detail__quick-spec-value">{{ formatMileage(car.mileage) }}km</span>
            </div>
            <div class="car-detail__quick-spec">
              <span class="car-detail__quick-spec-label">修復歴</span>
              <span class="car-detail__quick-spec-value">{{ formatRepairHistory(car.repairHistory) }}</span>
            </div>
            <div class="car-detail__quick-spec">
              <span class="car-detail__quick-spec-label">車検</span>
              <span class="car-detail__quick-spec-value">{{ formatInspection(car.inspectionStatus, car.inspectionExpireDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 車両の状態 -->
      <div class="car-detail__section">
        <h2 class="car-detail__section-title">車両の状態</h2>
        <div class="car-detail__table">
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">年式</div>
            <div class="car-detail__table-value">{{ car.modelYear ? `${car.modelYear}年` : '-' }}</div>
            <div class="car-detail__table-label">ワンオーナー</div>
            <div class="car-detail__table-value">{{ hasOption('one_owner') ? 'あり' : '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">走行距離</div>
            <div class="car-detail__table-value">{{ formatMileage(car.mileage) }}km</div>
            <div class="car-detail__table-label">キャンピングカー</div>
            <div class="car-detail__table-value">{{ hasOption('camping') ? 'あり' : '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">修復歴</div>
            <div class="car-detail__table-value">{{ formatRepairHistory(car.repairHistory) }}</div>
            <div class="car-detail__table-label">福祉車両</div>
            <div class="car-detail__table-value">{{ hasOption('welfare') ? 'あり' : '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">車検</div>
            <div class="car-detail__table-value">{{ formatInspection(car.inspectionStatus, car.inspectionExpireDate) }}</div>
            <div class="car-detail__table-label">登録済未使用車</div>
            <div class="car-detail__table-value">{{ hasOption('unregistered2') ? 'あり' : '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">色</div>
            <div class="car-detail__table-value">{{ car.color || '-' }}</div>
            <div class="car-detail__table-label">エコカー減税対象</div>
            <div class="car-detail__table-value">{{ hasOption('eco_car') ? 'あり' : '-' }}</div>
          </div>
        </div>
      </div>

      <!-- 車両のスペック -->
      <div class="car-detail__section">
        <h2 class="car-detail__section-title">車両のスペック</h2>
        <div class="car-detail__table">
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">ボディタイプ</div>
            <div class="car-detail__table-value">{{ car.bodyTypeName || '-' }}</div>
            <div class="car-detail__table-label">駆動方式</div>
            <div class="car-detail__table-value">{{ car.driveSystem || '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">ボディカラー</div>
            <div class="car-detail__table-value">{{ car.color || '-' }}</div>
            <div class="car-detail__table-label">ハンドル</div>
            <div class="car-detail__table-value">{{ formatSteering(car.steeringWheel) }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">排気量</div>
            <div class="car-detail__table-value">{{ car.displacement ? `${car.displacement.toLocaleString()}cc` : '-' }}</div>
            <div class="car-detail__table-label">ミッション</div>
            <div class="car-detail__table-value">{{ car.transmission || '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">エンジン種別</div>
            <div class="car-detail__table-value">{{ formatFuelType(car.fuelType) }}</div>
            <div class="car-detail__table-label">乗車定員</div>
            <div class="car-detail__table-value">{{ car.ridingCapacity ? `${car.ridingCapacity}名` : '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">ドア数</div>
            <div class="car-detail__table-value">{{ car.numberOfDoors ? `${car.numberOfDoors}ドア` : '-' }}</div>
            <div class="car-detail__table-label">スライドドア</div>
            <div class="car-detail__table-value">{{ formatSlideDoor(car.slideDoor) }}</div>
          </div>
        </div>
      </div>

      <!-- カタログスペック -->
      <div class="car-detail__section" v-if="vehicleSpec">
        <h2 class="car-detail__section-title">カタログスペック</h2>
        <div class="car-detail__table">
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">型式名</div>
            <div class="car-detail__table-value">{{ vehicleSpec.vehicle?.name || '-' }}</div>
            <div class="car-detail__table-label">モデルコード</div>
            <div class="car-detail__table-value">{{ vehicleSpec.vehicle?.modelCode || '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">排気量</div>
            <div class="car-detail__table-value">{{ vehicleSpec.vehicleVersion?.displacementCc ? `${vehicleSpec.vehicleVersion.displacementCc.toLocaleString()}cc` : '-' }}</div>
            <div class="car-detail__table-label">駆動方式</div>
            <div class="car-detail__table-value">{{ vehicleSpec.vehicleVersion?.driveType || '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">ミッション</div>
            <div class="car-detail__table-value">{{ vehicleSpec.vehicleVersion?.transmissionType || '-' }}</div>
            <div class="car-detail__table-label">車両重量</div>
            <div class="car-detail__table-value">{{ vehicleSpec.vehicleVersion?.weightKg ? `${vehicleSpec.vehicleVersion.weightKg.toLocaleString()}kg` : '-' }}</div>
          </div>
          <div class="car-detail__table-row">
            <div class="car-detail__table-label">燃費</div>
            <div class="car-detail__table-value">
              {{ vehicleSpec.vehicleVersion?.fuelEfficiencyFrom && vehicleSpec.vehicleVersion?.fuelEfficiencyTo
                ? `${vehicleSpec.vehicleVersion.fuelEfficiencyFrom}〜${vehicleSpec.vehicleVersion.fuelEfficiencyTo}km/L`
                : vehicleSpec.vehicleVersion?.fuelEfficiencyFrom
                  ? `${vehicleSpec.vehicleVersion.fuelEfficiencyFrom}km/L`
                  : '-'
              }}
            </div>
            <div class="car-detail__table-label">最高出力</div>
            <div class="car-detail__table-value">{{ vehicleSpec.vehicleVersion?.maxPowerKw ? `${vehicleSpec.vehicleVersion.maxPowerKw}kW` : '-' }}</div>
          </div>
        </div>
      </div>

      <!-- 装備仕様 -->
      <div class="car-detail__section">
        <h2 class="car-detail__section-title">装備仕様</h2>

        <div
          v-for="equip in equipmentSections"
          :key="equip.key"
          class="car-detail__equip-section"
        >
          <div
            class="car-detail__equip-header"
            @click="toggleEquipSection(equip.key)"
          >
            <span>{{ equip.label }}</span>
            <span>{{ openEquipSections.includes(equip.key) ? '−' : '+' }}</span>
          </div>
          <div v-if="openEquipSections.includes(equip.key)" class="car-detail__equip-grid">
            <div
              v-for="item in equip.items"
              :key="item.value"
              class="car-detail__equip-item"
              :class="{ 'is-equipped': hasEquipment(item.value) }"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- ローン詳細セクション -->
      <div class="car-detail__section" v-if="loan">
        <h2 class="car-detail__section-title">ローン支払い（参考）</h2>

        <div class="car-detail__loan-detail">
          <!-- 通常ローン + 月々金額 -->
          <div class="car-detail__loan-detail-header">
            <span class="car-detail__loan-detail-type">通常ローン</span>
            <span class="car-detail__loan-detail-monthly">
              月々<em>{{ loan.monthly_payments.at(-1)?.amount.toLocaleString() }}</em>円
            </span>
            <!-- ローン詳細セクションのボタン -->
            <button class="car-detail__loan-simulator-btn" @click="showLoanSimulator = true">
              ローンシミュレーター
            </button>
            <!-- モーダル -->
            <LoanSimulatorModal
              :show="showLoanSimulator"
              :price="car.price"
              :interest-rate-default="loan.interest_rate"
              :months-options="loan.monthly_payments.map(p => p.months)"
              @close="showLoanSimulator = false"
            />
          </div>

          <!-- 詳細テーブル -->
          <div class="car-detail__loan-detail-table">
            <div class="car-detail__loan-detail-row">
              <div class="car-detail__loan-detail-label">実質年率</div>
              <div class="car-detail__loan-detail-value">{{ loan.interest_rate }}%</div>
              <div class="car-detail__loan-detail-label">初回お支払い額</div>
              <div class="car-detail__loan-detail-value">
                {{ loan.monthly_payments[0]?.amount.toLocaleString() }}円
              </div>
            </div>
            <div class="car-detail__loan-detail-row">
              <div class="car-detail__loan-detail-label">頭金</div>
              <div class="car-detail__loan-detail-value">
                {{ loan.down_payment ? `${loan.down_payment.toLocaleString()}円` : '-円' }}
              </div>
              <div class="car-detail__loan-detail-label">総支払回数</div>
              <div class="car-detail__loan-detail-value">
                {{ loan.monthly_payments.at(-1)?.months }}回
              </div>
            </div>
            <div class="car-detail__loan-detail-row">
              <div class="car-detail__loan-detail-label">ボーナス月加算額</div>
              <div class="car-detail__loan-detail-value">
                {{ loan.bonus_amount ? `${loan.bonus_amount.toLocaleString()}円` : '-円' }}
              </div>
              <div class="car-detail__loan-detail-label">割賦販売価格</div>
              <div class="car-detail__loan-detail-value">
                {{ (loan.monthly_payments.at(-1)?.amount * loan.monthly_payments.at(-1)?.months + (loan.down_payment ?? 0)).toLocaleString() }}円
              </div>
            </div>
          </div>

          <!-- ローン会社（後で差し込み） -->
          <div class="car-detail__loan-companies" v-if="false">
            <!-- TODO: テーブルから取得後に実装 -->
          </div>

          <!-- 注意書き -->
          <div class="car-detail__loan-notes">
            <p>※上記のお支払い例は、あくまでも参考例です。</p>
            <p>※詳しくは、各販売店までお問い合わせください。</p>
          </div>
        </div>
      </div>

      <!-- 販売店の評判・クチコミ -->
      <div class="car-detail__section" v-if="reviews.length > 0">
        <h2 class="car-detail__section-title">販売店の評判・口コミ</h2>
        <div class="car-detail__review-carousel">
          <button
            v-if="reviews.length > 1"
            class="car-detail__review-prev"
            @click="prevReview"
          >‹</button>

          <div class="car-detail__review-card">
            <div class="car-detail__review-rating">
              <span
                v-for="n in 5"
                :key="n"
                class="car-detail__review-star"
                :class="{ 'is-active': n <= currentReview.rating }"
              >★</span>
              <span class="car-detail__review-score">{{ currentReview.rating }}.0</span>
            </div>
            <p class="car-detail__review-comment">
              {{ reviewExpanded ? currentReview.comment : truncateComment(currentReview.comment) }}
              <span
                v-if="currentReview.comment && currentReview.comment.length > 80"
                class="car-detail__review-more"
                @click="reviewExpanded = !reviewExpanded"
              >
                {{ reviewExpanded ? '閉じる' : '続きを読む ›' }}
              </span>
            </p>
            <div class="car-detail__review-meta">
              <span>投稿日：{{ formatDate(currentReview.created_at) }}</span>
            </div>
          </div>

          <button
            v-if="reviews.length > 1"
            class="car-detail__review-next"
            @click="nextReview"
          >›</button>
        </div>

        <!-- ドット -->
        <div class="car-detail__review-dots">
          <span
            v-for="(_, idx) in reviews"
            :key="idx"
            class="car-detail__review-dot"
            :class="{ 'is-active': currentReviewIndex === idx }"
            @click="currentReviewIndex = idx; reviewExpanded = false"
          />
        </div>
      </div>

      <!-- 販売店情報 -->
      <div class="car-detail__section" v-if="dealer">
        <h2 class="car-detail__section-title">販売店情報</h2>
        <div class="car-detail__dealer">
          <div class="car-detail__dealer-info">
            <h3 class="car-detail__dealer-name">{{ dealer.name }}</h3>
            <div class="car-detail__dealer-table">
              <div class="car-detail__dealer-row">
                <span class="car-detail__dealer-label">住所</span>
                <span class="car-detail__dealer-value">
                  〒{{ dealer.postal_code }} {{ dealer.city }}{{ dealer.address_detail }}
                </span>
              </div>
              <div class="car-detail__dealer-row">
                <span class="car-detail__dealer-label">TEL</span>
                <span class="car-detail__dealer-value">{{ dealer.phone || '-' }}</span>
              </div>
              <div class="car-detail__dealer-row">
                <span class="car-detail__dealer-label">営業時間</span>
                <span class="car-detail__dealer-value">{{ dealer.business_hours || '-' }}</span>
              </div>
              <div class="car-detail__dealer-row">
                <span class="car-detail__dealer-label">定休日</span>
                <span class="car-detail__dealer-value">{{ dealer.regular_holiday || '-' }}</span>
              </div>
            </div>
            <div class="car-detail__dealer-actions">
              <button class="car-detail__map-btn" @click="openMap">
                MAP を開く
              </button>
              <button class="car-detail__inquiry-btn" @click="showInquiry = true">
                在庫確認・見積依頼
              </button>
            </div>
          </div>
        </div>
      
        <!-- 販売店情報セクションの下に追加 -->
        <div class="car-detail__section" v-if="dealer">
          <ReservationCalendar
            :dealerId="car.dealerId"
            :carId="car.id"
          />
        </div>
      </div>

      
      <!-- 追従バー -->
        <div class="car-detail__sticky-bar" :class="{ 'is-visible': showStickyBar }">
          <div class="car-detail__sticky-toggle" @click="stickyOpen = !stickyOpen">
            {{ stickyOpen ? '▼' : '▲' }}
          </div>
          <div v-show="stickyOpen" class="car-detail__sticky-bar-inner">
            <!-- 左：車両画像 + 車両名 -->
            <div class="car-detail__sticky-left">
              <div class="car-detail__sticky-img">
                <img v-if="currentImage" :src="imageBaseUrl + currentImage.imageUrl" alt="車両画像" />
                <div v-else class="car-detail__sticky-noimg">NO IMAGE</div>
              </div>
              <div class="car-detail__sticky-car-info">
                <div class="car-detail__sticky-car-name">{{ car?.makerName }} {{ car?.vehicleName }}</div>
                <div class="car-detail__sticky-car-grade">{{ car?.gradeName }}</div>
              </div>
            </div>

            <!-- 中央：価格 -->
            <div class="car-detail__sticky-price">
              <span class="car-detail__sticky-price-label">支払総額（税込）</span>
              <span class="car-detail__sticky-price-val">{{ formatPrice(car?.totalPrice ?? car?.price) }}</span>
              <span class="car-detail__price-misc" v-if="car.miscFees">
                （諸費用 {{ formatPrice(car.miscFees) }}含む）
              </span>
            </div>

            <div class="car-detail__sticky-price">
              <span class="car-detail__sticky-price-label">車両本体価格（税込）</span>
              <span class="car-detail__sticky-price-val">{{ formatPrice(car.priceWithTax ?? car.price) }}</span>
            </div>

            <!-- 右：店舗情報 + ボタン -->
            <div class="car-detail__sticky-right">
              <div class="car-detail__sticky-dealer">
                <div class="car-detail__sticky-dealer-name">{{ dealer?.name }}</div>
                <div class="car-detail__sticky-dealer-phone">{{ dealer?.phone }}</div>
              </div>
              <div class="car-detail__sticky-actions">
                <button class="car-detail__sticky-fav" @click="toggleFavorite">
                  {{ isFavorite ? '♥' : '♡' }}
                </button>
                <button class="car-detail__sticky-inquiry" @click="showInquiry = true">
                  在庫確認・見積依頼
                </button>
              </div>
            </div>
          </div>
        </div>
    </template>

    <div v-else class="car-detail__not-found">
      車両情報が見つかりませんでした。
    </div>
  </div>

  <InquiryModal
    :show="showInquiry"
    :car-id="Number(car?.id)"
    :dealer-id="Number(car?.dealerId)"
    @close="showInquiry = false"
  />
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { formatPrice, formatMileage, formatRepairHistory, formatInspection, formatSteering, formatFuelType, formatSlideDoor} from '@/utils/format'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import ReservationCalendar from '@/components/Reservation/ReservationCalendar.vue'
  import LoanSimulatorModal from '@/components/Loan/LoanSimulatorModal.vue'
  import { useMemberAuthStore } from '@/stores/memberAuth'
  import InquiryModal from '@/components/Inquiry/InquiryModal.vue'
  import { useViewCount } from '@/composables/Analytics/useViewCount'
  const showInquiry = ref(false)
  const memberAuthStore = useMemberAuthStore()

  const route = useRoute()
  const carId = route.params.id

  const car           = ref(null)
  const images        = ref([])
  const options       = ref([])
  const reviews       = ref([])
  const dealer        = ref(null)
  const loading       = ref(true)
  const isFavorite    = ref(false)
  const showLoanSimulator = ref(false)
  const equipmentBasicOptions   = ref([])
  const equipmentSafetyOptions  = ref([])
  const equipmentEnvOptions     = ref([])
  const equipmentSeatOptions    = ref([])
  const equipmentDressupOptions = ref([])

  const showStickyBar = ref(false)
  const stickyOpen = ref(true)  // 最初は開いた状態
  const vehicleSpec = ref(null)
  const loan = ref(null)

  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL

  // 画像関連
  const imageCategory     = ref('all')
  const currentImageIndex = ref(0)

  const filteredImages = computed(() => {
    if (imageCategory.value === 'all') return images.value
    return images.value.filter(img => img.image_type === imageCategory.value)
  })
  const currentImage = computed(() => filteredImages.value[currentImageIndex.value] ?? null)

  const thumbPage = ref(0)
  const thumbPerPage = 10

  const totalThumbPages = computed(() => Math.ceil(filteredImages.value.length / thumbPerPage))

  const thumbImages = computed(() => {
    const start = thumbPage.value * thumbPerPage
    return filteredImages.value.slice(start, start + thumbPerPage)
  })

  const selectImage = (idx) => {
    currentImageIndex.value = thumbPage.value * thumbPerPage + idx
  }

  const isCurrentThumb = (idx) => {
    return (thumbPage.value * thumbPerPage + idx) === currentImageIndex.value
  }

  const syncThumbPage = () => {
    thumbPage.value = Math.floor(currentImageIndex.value / thumbPerPage)
  }

  // 既存のprevImage・nextImageを修正
  const prevImage = () => {
    currentImageIndex.value = currentImageIndex.value === 0
      ? filteredImages.value.length - 1
      : currentImageIndex.value - 1
    syncThumbPage()
  }

  const nextImage = () => {
    currentImageIndex.value = currentImageIndex.value === filteredImages.value.length - 1
      ? 0
      : currentImageIndex.value + 1
    syncThumbPage()
  }

  // クチコミ関連
  const currentReviewIndex = ref(0)
  const reviewExpanded     = ref(false)
  const currentReview      = computed(() => reviews.value[currentReviewIndex.value] ?? {})
  const prevReview = () => {
    currentReviewIndex.value = currentReviewIndex.value === 0
      ? reviews.value.length - 1
      : currentReviewIndex.value - 1
    reviewExpanded.value = false
  }
  const nextReview = () => {
    currentReviewIndex.value = currentReviewIndex.value === reviews.value.length - 1
      ? 0
      : currentReviewIndex.value + 1
    reviewExpanded.value = false
  }
  const truncateComment = (comment) => {
    if (!comment) return ''
    return comment.length > 80 ? comment.slice(0, 80) + '...' : comment
  }

  // 装備セクション
  const openEquipSections = ref(['safety', 'basic', 'seat', 'dress_up', 'env'])
  const toggleEquipSection = (key) => {
    const idx = openEquipSections.value.indexOf(key)
    idx === -1 ? openEquipSections.value.push(key) : openEquipSections.value.splice(idx, 1)
  }

  const hasEquipment = (value) => options.value.some(o => o.optionName === value && o.isEquipped)
  const hasOption    = (value) => options.value.some(o => o.optionName === value && o.isEquipped)

  const openMap = () => {
    if (!dealer.value?.latitude || !dealer.value?.longitude) return
    window.open(`https://www.google.com/maps?q=${dealer.value.latitude},${dealer.value.longitude}`, '_blank')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('ja-JP')
  }

  // useViewCountを呼び出してstartを取得
  const { start: startViewCount } = useViewCount({
    getCarId:    () => Number(carId),
    getDealerId: () => Number(car.value?.dealerId), // ← 関数として渡す
  })

  // データ取得
  const fetchAll = async () => {
    loading.value = true
    try {
      const [carRes, equipBasicRes, equipSafetyRes, equipEnvRes, equipSeatRes, equipDressupRes] = await Promise.all([
        axios.get('/api/SelectCarData', { params: { carId: carId } }),
        axios.get('/api/SearchOptions/EquipmentBasic'),
        axios.get('/api/SearchOptions/EquipmentSafety'),
        axios.get('/api/SearchOptions/EquipmentEnv'),
        axios.get('/api/SearchOptions/SeatOption'),
        axios.get('/api/SearchOptions/EquipmentDressup'),
      ])

      const data = carRes.data

      car.value = {
        ...data.carData,
        firstRegistrationDate:  data.carDetailData?.firstRegistrationDate,
        inspectionExpireDate:   data.carDetailData?.inspectionExpireDate,
        inspectionStatus:       data.carDetailData?.inspectionStatus,
        driveSystem:            data.carDetailData?.driveSystem,
        displacement:           data.carDetailData?.displacement,
        steeringWheel:          data.carDetailData?.steeringWheel,
        numberOfDoors:          data.carDetailData?.numberOfDoors,
        slideDoor:              data.carDetailData?.slideDoor,
        ridingCapacity:         data.carDetailData?.ridingCapacity,
      }
      images.value  = data.carImages ?? []
      options.value = data.carOptions ?? []

      equipmentBasicOptions.value   = equipBasicRes.data
      equipmentSafetyOptions.value  = equipSafetyRes.data
      equipmentEnvOptions.value     = equipEnvRes.data
      equipmentSeatOptions.value    = equipSeatRes.data
      equipmentDressupOptions.value = equipDressupRes.data


      const [dealerRes, reviewRes, vehicleSpecRes] = await Promise.all([
        //ディーラー情報
        axios.get('/api/SelectDealerData', { params: { dealerId: data.carData.dealerId } }),
        //口コミ取得
        axios.get('/api/SelectDealerReview', { params: { dealerId: data.carData.dealerId } }),
        axios.get('/api/SelectVehicleSpec', { params: { vehicleId: data.carData.vehicleId } }),
      ])
      dealer.value  = dealerRes.data.dealerData
      reviews.value = reviewRes.data.reviews ?? []
      vehicleSpec.value  = vehicleSpecRes.data

      // fetchAll完了後にviewCountを開始
      await startViewCount()
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const fetchLoan = async () => {
    try {
      const loanRes = await axios.get('/api/SelectCarLoan', { params: { carId: carId } })
      loan.value = loanRes.data.success ? loanRes.data.loan : null
    } catch (e) {
      loan.value = null
    }
  }

  const equipmentSections = computed(() => [
    { key: 'safety',   label: '安全装備', items: equipmentSafetyOptions.value },
    { key: 'basic',    label: '快適装備', items: equipmentBasicOptions.value },
    { key: 'seat',     label: 'インテリア', items: equipmentSeatOptions.value },
    { key: 'dress_up', label: 'エクステリア', items: equipmentDressupOptions.value },
    { key: 'env', label: '環境装備', items: equipmentEnvOptions.value },
  ])

  const scrollToLoan = () => {
  const loanSection = document.querySelector('.car-detail__loan-detail')
    if (!loanSection) return
    loanSection.scrollIntoView({ behavior: 'smooth' })
  }

  // お気に入り登録
  const fetchFavoriteStatus = async () => {
    if (!memberAuthStore.isLoggedIn) return
    try {
      const res = await axios.get('/api/Favorites/isFavorite', {
        params: { carId: carId }
      })
      if (res.data.success) {
        isFavorite.value = res.data.is_favorite
      }
    } catch (e) {
      console.error(e)
    }
  }

  const toggleFavorite = async () => {
    if (!memberAuthStore.isLoggedIn) {
      isFavorite.value = !isFavorite.value
      return
    }
    try {
      const res = await axios.patch('/api/Favorites/toggle', null, {
        params: { carId: carId }
      })
      if (res.data.success) {
        isFavorite.value = res.data.is_favorite
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(() => {

    fetchAll()
    fetchLoan()
    fetchFavoriteStatus()

    window.addEventListener('scroll', () => {
      const imageArea    = document.querySelector('.car-detail__image-area')
      const dealerSection = document.querySelector('.car-detail__dealer')
      if (!imageArea) return
      const imageBottom = imageArea.getBoundingClientRect().bottom
      const dealerTop   = dealerSection?.getBoundingClientRect().top ?? Infinity
      showStickyBar.value = imageBottom < 0 && dealerTop > window.innerHeight
    })
  })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.car-detail-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 48px;
  padding-bottom: 120px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Montserrat', sans-serif;
}

.loading {
  font-size: 12px;
  color: #666;
  letter-spacing: 0.1em;
}

/* ===== ヘッダー ===== */
.car-detail__header { margin-bottom: 32px; }
.car-detail__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0 0 8px;
}
.car-detail__subtitle {
  font-size: 13px;
  font-weight: 300;
  color: #888;
  letter-spacing: 0.05em;
  margin: 0;
}

/* ===== メインエリア 7:3 ===== */
.car-detail__main {
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: 24px;
  margin-bottom: 48px;
}

/* ===== 画像エリア ===== */
.car-detail__image-area { display: flex; flex-direction: column; gap: 12px; }

.car-detail__main-image {
  position: relative;
  background: #111;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.car-detail__main-image img { width: 100%; height: 100%; object-fit: cover; }
.car-detail__no-image { font-size: 12px; color: #444; letter-spacing: 0.1em; }

.car-detail__image-prev,
.car-detail__image-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  color: #fff;
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.car-detail__image-prev { left: 12px; }
.car-detail__image-next { right: 12px; }
.car-detail__image-prev:hover,
.car-detail__image-next:hover { background: rgba(220,80,120,0.7); }

.car-detail__image-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}
.car-detail__select {
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 3px;
  padding: 6px 28px 6px 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #ccc;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.car-detail__thumbnails {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.car-detail__thumbnail {
  height: 54px;
  background: #111;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}
.car-detail__thumbnail.is-active { border-color: #dc5078; }
.car-detail__thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.car-detail__thumbnail-noimg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #444;
}

/* ===== 価格エリア ===== */
.car-detail__price-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.car-detail__price-block {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 20px;
}
.car-detail__price-label {
  font-size: 11px;
  color: #888;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}
.car-detail__price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 400;
  color: #dc5078;
  line-height: 1;
}
.car-detail__price-unit { font-size: 16px; margin-left: 2px; }

.car-detail__actions { display: flex; flex-direction: column; gap: 10px; }

.car-detail__fav-btn {
  padding: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  background: transparent;
  color: #888;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}
.car-detail__fav-btn.is-active {
  border-color: #dc5078;
  color: #dc5078;
  background: rgba(220,80,120,0.1);
}
.car-detail__fav-btn:hover { border-color: #dc5078; color: #dc5078; }

.car-detail__inquiry-btn {
  padding: 12px;
  border: none;
  border-radius: 4px;
  background: #dc5078;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: 0.05em;
}
.car-detail__inquiry-btn:hover { background: #c44068; }

.car-detail__quick-specs {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.car-detail__quick-spec { display: flex; justify-content: space-between; align-items: center; }
.car-detail__quick-spec-label { font-size: 11px; color: #666; }
.car-detail__quick-spec-value { font-size: 12px; font-weight: 500; color: #ccc; }

/* ===== セクション共通 ===== */
.car-detail__section {
  margin-bottom: 48px;
  border-top: 1px solid #1a1a1a;
  padding-top: 32px;
}
.car-detail__section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0 0 24px;
  padding-left: 12px;
  border-left: 3px solid #dc5078;
}

/* ===== テーブル ===== */
.car-detail__table { border: 1px solid #1a1a1a; border-radius: 4px; overflow: hidden; }
.car-detail__table-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 2fr;
  border-bottom: 1px solid #1a1a1a;
}
.car-detail__table-row:last-child { border-bottom: none; }
.car-detail__table-label {
  padding: 12px 16px;
  font-size: 11px;
  color: #666;
  background: #111;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;
}
.car-detail__table-value {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
  background: #0d0d0d;
  display: flex;
  align-items: center;
}

/* ===== 装備仕様 ===== */
.car-detail__equip-section { margin-bottom: 8px; border: 1px solid #1a1a1a; border-radius: 4px; overflow: hidden; }
.car-detail__equip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #111;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
  letter-spacing: 0.05em;
  transition: background 0.15s;
}
.car-detail__equip-header:hover { background: #1a1a1a; }

.car-detail__equip-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 16px;
  background: #0d0d0d;
}
.car-detail__equip-item {
  padding: 8px 12px;
  border-radius: 3px;
  font-size: 11px;
  letter-spacing: 0.03em;
  background: #1a1a1a;
  color: #444;
  border: 1px solid #1a1a1a;
}
.car-detail__equip-item.is-equipped {
  background: rgba(220, 80, 120, 0.1);
  color: #dc5078;
  border-color: rgba(220, 80, 120, 0.3);
}

/* ===== クチコミ ===== */
.car-detail__review-carousel {
  display: flex;
  align-items: center;
  gap: 16px;
}
.car-detail__review-prev,
.car-detail__review-next {
  background: transparent;
  border: 1px solid #333;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.car-detail__review-prev:hover,
.car-detail__review-next:hover { border-color: #dc5078; color: #dc5078; }

.car-detail__review-card {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 24px;
}
.car-detail__review-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
.car-detail__review-star { font-size: 18px; color: #333; }
.car-detail__review-star.is-active { color: #f59e0b; }
.car-detail__review-score { font-size: 20px; font-weight: 500; color: #ccc; margin-left: 8px; }
.car-detail__review-comment { font-size: 13px; color: #aaa; line-height: 1.8; margin-bottom: 16px; }
.car-detail__review-more { color: #dc5078; cursor: pointer; font-size: 12px; margin-left: 4px; }
.car-detail__review-meta { font-size: 11px; color: #555; }

.car-detail__review-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
.car-detail__review-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
  cursor: pointer;
  transition: background 0.15s;
}
.car-detail__review-dot.is-active { background: #dc5078; }

/* ===== 販売店情報 ===== */
.car-detail__dealer-name {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: 0.05em;
}
.car-detail__dealer-table { margin-bottom: 20px; }
.car-detail__dealer-row {
  display: flex;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #1a1a1a;
}
.car-detail__dealer-row:last-child { border-bottom: none; }
.car-detail__dealer-label { font-size: 11px; color: #666; min-width: 80px; }
.car-detail__dealer-value { font-size: 13px; color: #ccc; }

.car-detail__dealer-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.car-detail__map-btn {
  padding: 10px 20px;
  border: 1px solid #333;
  border-radius: 4px;
  background: transparent;
  color: #aaa;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}
.car-detail__map-btn:hover { border-color: #555; color: #fff; }

.car-detail__not-found {
  font-size: 13px;
  color: #666;
  text-align: center;
  padding: 48px;
}

.car-detail__loan {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #2a2a2a;
}
.car-detail__loan-header {
  font-size: 11px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.car-detail__loan-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.car-detail__loan-label {
  font-size: 10px;
  color: #666;
  display: block;
  margin-bottom: 2px;
}
.car-detail__loan-price {
  font-size: 18px;
  font-weight: 500;
  color: #ccc;
}
.car-detail__loan-rate-val {
  font-size: 16px;
  font-weight: 500;
  color: #dc5078;
}
.car-detail__loan-note {
  font-size: 10px;
  color: #555;
  margin: 0;
}

.car-detail__sticky-bar {
  position: fixed;
  bottom: -100px;       /* 高さ増やしたので調整 */
  left: 0;
  right: 0;
  background: #0d0d0d;
  border-top: 1px solid #222;
  padding: 16px 48px;   /* 上下パディング増加 */
  transition: bottom 0.3s ease;
  z-index: 100;
}
.car-detail__sticky-bar.is-visible { bottom: 0; }

.car-detail__sticky-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.car-detail__sticky-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.car-detail__sticky-img {
  width: 64px;
  height: 48px;
  border-radius: 4px;
  overflow: hidden;
  background: #111;
  flex-shrink: 0;
}
.car-detail__sticky-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.car-detail__sticky-noimg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #444;
}
.car-detail__sticky-car-name {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}
.car-detail__sticky-car-grade {
  font-size: 11px;
  color: #666;
  white-space: nowrap;
}

.car-detail__sticky-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.car-detail__sticky-price-label { font-size: 10px; color: #666; }
.car-detail__sticky-price-val {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 400;
  color: #dc5078;
  line-height: 1;
}

.car-detail__sticky-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}
.car-detail__sticky-dealer-name {
  font-size: 12px;
  font-weight: 500;
  color: #ccc;
  white-space: nowrap;
}
.car-detail__sticky-dealer-phone {
  font-size: 13px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.05em;
}

.car-detail__sticky-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.car-detail__sticky-fav {
  width: 40px;
  height: 40px;
  border: 1px solid #333;
  border-radius: 50%;
  background: transparent;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s;
}
.car-detail__sticky-fav:hover { border-color: #dc5078; color: #dc5078; }
.car-detail__sticky-inquiry {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #dc5078;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.car-detail__sticky-inquiry:hover {
  background: #c44068;
}

.car-detail__sticky-toggle {
  text-align: center;
  font-size: 10px;
  color: #666;
  cursor: pointer;
  padding: 2px 0 6px;
  letter-spacing: 0.1em;
}
.car-detail__sticky-toggle:hover { color: #dc5078; }


/* ローン */
.car-detail__loan-detail {
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
}

.car-detail__loan-detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #2a2a2a;
}
.car-detail__loan-detail-type {
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
}
.car-detail__loan-detail-monthly {
  font-size: 14px;
  color: #888;
}
.car-detail__loan-detail-monthly em {
  font-style: normal;
  font-size: 28px;
  font-weight: 500;
  color: #dc5078;
  margin: 0 2px;
}

.car-detail__loan-detail-table {
  border-bottom: 1px solid #2a2a2a;
}
.car-detail__loan-detail-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 2fr;
  border-bottom: 1px solid #1a1a1a;
}
.car-detail__loan-detail-row:last-child { border-bottom: none; }
.car-detail__loan-detail-label {
  padding: 16px 20px;
  font-size: 12px;
  color: #666;
  background: #111;
  display: flex;
  align-items: center;
}
.car-detail__loan-detail-value {
  padding: 16px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
  background: #0d0d0d;
  display: flex;
  align-items: center;
}

.car-detail__loan-notes {
  padding: 16px 24px;
  background: #0d0d0d;
}
.car-detail__loan-notes p {
  font-size: 11px;
  color: #555;
  margin: 0 0 4px;
}
.car-detail__loan-notes p:last-child { margin: 0; }


.car-detail__thumbnails-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.car-detail__thumb-nav {
  background: #dc5078;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 44px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.car-detail__thumb-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.car-detail__thumb-nav:not(:disabled):hover {
  background: #c44068;
}

.car-detail__thumbnails {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}

.car-detail__thumbnail {
  aspect-ratio: 4/3;
  background: #111;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}
.car-detail__thumbnail.is-active { border-color: #dc5078; }
.car-detail__thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.car-detail__thumbnail-noimg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #444;
}

.car-detail__loan-simulator-btn {
  padding: 10px 20px;
  border: 1px solid #dc5078;
  border-radius: 4px;
  background: transparent;
  color: #dc5078;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}
.car-detail__loan-simulator-btn:hover {
  background: rgba(220, 80, 120, 0.1);
}

.car-detail__price-row {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 8px;
}

.car-detail__price-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.car-detail__price-divider {
  width: 1px;
  background: #2a2a2a;
  align-self: stretch;
  margin: 0 20px;
}

.car-detail__price--base {
  font-size: 24px;
  color: #ccc;
}

.car-detail__price-unit--base {
  font-size: 13px;
  color: #ccc;
}

.car-detail__price-misc {
  font-size: 11px;
  color: #666;
}
</style>