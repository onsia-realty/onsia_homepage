/**
 * schema.prisma를 site 스키마에 맞게 변환
 * - generator에 previewFeatures = ["multiSchema"]
 * - datasource에 schemas = ["site"]
 * - 각 model에 @@schema("site") + @@map("snake_plural")
 * - 각 필드에 @map("snake_case") (camelCase → snake_case 변환)
 * - 각 enum에 @@schema("site") + @@map("snake_case")
 *
 * 코드는 PascalCase 단수형 model 이름 그대로 사용 가능.
 */

import fs from 'fs'

const SCHEMA = 'prisma/schema.prisma'

// ===== 매핑 테이블 =====

const MODEL_TO_TABLE = {
  User: 'users',
  Account: 'accounts',
  Session: 'sessions',
  VerificationToken: 'verification_tokens',
  Post: 'posts',
  Tag: 'tags',
  PostTag: 'post_tags',
  Video: 'videos',
  Company: 'companies',
  Developer: 'developers',
  Property: 'properties',
  PropertyImage: 'property_images',
  PropertyInquiry: 'property_inquiries',
  Investment: 'investments',
  AuctionItem: 'auction_items',
  AuctionBid: 'auction_bids',
  AuctionRegister: 'auction_registers',
  AuctionTenant: 'auction_tenants',
  AuctionImage: 'auction_item_images', // irregular
  Subscription: 'subscriptions',
  SubscriptionImage: 'subscription_images',
  SubscriptionHousingType: 'subscription_housing_types',
  Favorite: 'favorites',
  ViewHistory: 'view_history',         // irregular (no 's')
}

const ENUM_TO_TYPE = {
  UserRole: 'user_role',
  PropertyStatus: 'property_status',
  BuildingType: 'building_type',
  ImageType: 'image_type',
  InquiryType: 'inquiry_type',
  InquiryStatus: 'inquiry_status',
  PostCategory: 'post_category',
  PostStatus: 'post_status',
  SubscriptionStatus: 'subscription_status',
  SubscriptionImageCategory: 'subscription_image_category',
  AuctionItemType: 'auction_item_type',
  AuctionStatus: 'auction_status',
  AuctionBidResult: 'auction_bid_result',
  AuctionImageType: 'auction_image_type',
  FavoriteType: 'favorite_type',
}

// camelCase → snake_case
function camelToSnake(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
}

// 관계 필드 판별 (PascalCase 타입 + @relation 또는 [] 배열)
function isRelationField(line, allModels) {
  const m = line.match(/^\s+\w+\s+(\w+)(\?|\[\])?(.*)$/)
  if (!m) return false
  const type = m[1]
  const rest = m[3] || ''
  // PascalCase로 시작 + @relation 또는 [] (one-to-many)
  if (allModels.has(type) && (rest.includes('@relation') || m[2] === '[]')) {
    return true
  }
  // PascalCase + 단일 관계 (a Property -> property)
  if (allModels.has(type) && rest.includes('@relation')) {
    return true
  }
  return false
}

// ===== 파서 =====

function transform(src) {
  const allModels = new Set(Object.keys(MODEL_TO_TABLE))

  // 1. generator에 previewFeatures
  src = src.replace(
    /(generator client \{[^}]*?)(\n\})/s,
    (m, body, end) => {
      if (body.includes('previewFeatures')) return m
      return body + '\n  previewFeatures = ["multiSchema"]' + end
    }
  )

  // 2. datasource에 schemas
  src = src.replace(
    /(datasource db \{[^}]*?)(\n\})/s,
    (m, body, end) => {
      if (body.includes('schemas')) return m
      return body + '\n  schemas   = ["site"]' + end
    }
  )

  // 3. line-by-line 파싱
  const lines = src.split('\n')
  const out = []

  let inModel = null
  let inEnum = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // model 시작
    const modelStart = line.match(/^model\s+(\w+)\s*\{/)
    if (modelStart) {
      inModel = modelStart[1]
      out.push(line)
      continue
    }

    // enum 시작
    const enumStart = line.match(/^enum\s+(\w+)\s*\{/)
    if (enumStart) {
      inEnum = enumStart[1]
      out.push(line)
      continue
    }

    // 블록 종료
    if (line.match(/^\}/)) {
      if (inModel) {
        const tableName = MODEL_TO_TABLE[inModel]
        if (tableName) {
          // 기존 @@map/@@schema 있는지 확인 (재실행 안전성)
          const blockText = out.slice(out.lastIndexOf(`model ${inModel} {`)).join('\n')
          if (!blockText.includes('@@schema(')) {
            out.push(`  @@schema("site")`)
          }
          if (!blockText.includes('@@map(')) {
            out.push(`  @@map("${tableName}")`)
          }
        }
        inModel = null
      } else if (inEnum) {
        const enumType = ENUM_TO_TYPE[inEnum]
        if (enumType) {
          const blockText = out.slice(out.lastIndexOf(`enum ${inEnum} {`)).join('\n')
          if (!blockText.includes('@@schema(')) {
            out.push(`  @@schema("site")`)
          }
          if (!blockText.includes('@@map(')) {
            out.push(`  @@map("${enumType}")`)
          }
        }
        inEnum = null
      }
      out.push(line)
      continue
    }

    // model 안의 필드
    if (inModel) {
      // 빈 줄, 주석, attribute는 그대로
      if (!line.trim() || line.trim().startsWith('//') || line.trim().startsWith('@@')) {
        out.push(line)
        continue
      }
      // 필드 라인 파싱
      const m = line.match(/^(\s+)(\w+)(\s+)(\w+)(\?|\[\])?(.*)$/)
      if (!m) {
        out.push(line)
        continue
      }
      const [, indent, fieldName, sp, type, modifier, rest] = m
      const isList = modifier === '[]'

      // 관계 필드 판별: PascalCase 타입이고 (@relation 포함 OR 배열)
      const isRelation = allModels.has(type) && (isList || rest.includes('@relation'))

      // 이미 @map 있으면 스킵
      if (rest.includes('@map(')) {
        out.push(line)
        continue
      }

      if (isRelation) {
        out.push(line)
        continue
      }

      // 필드 이름이 이미 snake_case면 @map 불필요 (예: id, url, name, slug)
      const snake = camelToSnake(fieldName)
      if (snake === fieldName) {
        out.push(line)
        continue
      }

      // @map 추가
      out.push(`${indent}${fieldName}${sp}${type}${modifier || ''}${rest} @map("${snake}")`)
      continue
    }

    out.push(line)
  }

  return out.join('\n')
}

const src = fs.readFileSync(SCHEMA, 'utf8')
const result = transform(src)
fs.writeFileSync(SCHEMA, result)
console.log('✅ prisma/schema.prisma 변환 완료')
