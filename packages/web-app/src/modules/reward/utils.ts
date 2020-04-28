import { RewardResource } from './models/RewardResource'
import { Reward } from './models/Reward'
import { Config } from '../../config'
import { RewardQuery, RewardSort } from './models'
import queryString from 'query-string'
import { RouteComponentProps } from 'react-router'

const toFullImageUrl = (url?: string): string | undefined => (url ? new URL(url, Config.baseAPIUrl).href : undefined)

export const rewardFromResource = (r: RewardResource): Reward => ({
  //Reward data
  id: r.id,
  name: r.name,
  releaseDate: r.releaseDate ? new Date(r.releaseDate) : undefined,
  addedDate: r.addedDate ? new Date(r.addedDate) : undefined,
  developerName: r.developerName,
  publisherName: r.publisherName,
  headline: r.headline,
  description: r.description,
  price: r.price,
  coverImage: toFullImageUrl(r.coverImage),
  heroImage: toFullImageUrl(r.heroImage),
  image: toFullImageUrl(r.image),
  images: r.images && r.images.map((x) => toFullImageUrl(x)),
  platform: r.platform,
  tags: r.tags && r.tags.map((x) => x.toLowerCase()),
  quantity: r.quantity,
  //TODO: Requirements...
})

export const encodeCategory = (category: string): string => {
  return encodeURIComponent(category.toLowerCase().replace(/\s/g, '-'))
}

export const decodeCategory = (category: string): string => {
  return decodeURIComponent(category.toLowerCase().replace(/-/g, ' '))
}

export const stringifyRewardQuery = (query: RewardQuery): string => {
  if (query.category) {
    query.category = query.category.map((x) => encodeCategory(x)).sort()
  }

  return queryString.stringify(query)
}

export const parseRewardQuery = (route: RouteComponentProps<{ category?: string }>): RewardQuery => {
  const query: RewardQuery = queryString.parse(route.location.search, { parseNumbers: true, parseBooleans: true })

  //If only 1 category is returned, then the value will be a string, we need to ensure that it is always an array
  if (query.category && !Array.isArray(query.category)) {
    query.category = [query.category]
  }

  //Adds the given category to the query
  if (route.match && route.match.params.category) {
    const category = route.match.params.category
    if (!query.category) {
      query.category = [category]
    } else if (query.category instanceof Array && !query.category.includes(category)) {
      query.category.push(category)
    }
  }

  if (query.category) {
    query.category = query.category.map((x) => decodeCategory(x))
  }

  return query
}

export const sortRewards = (rewards: Reward[], sort: RewardSort): Reward[] => {
  switch (sort) {
    case RewardSort.Alphabetical:
      return rewards.sort((a, b) => {
        let rewardAName = a?.name || ''
        let rewardBName = b?.name || ''

        return rewardAName > rewardBName ? 1 : rewardBName > rewardAName ? -1 : 0
      })

    case RewardSort.PriceAscending:
      return rewards.sort((a, b) => a.price - b.price)

    case RewardSort.PriceDescending:
      return rewards.sort((a, b) => b.price - a.price)

    case RewardSort.Default:
    default:
      return rewards.sort((a, b) => {
        let rewardAName = a?.name || ''
        let rewardBName = b?.name || ''

        //If we are out of stock, make them the lowest priority
        let rewardAStock = a?.quantity === 0 ? Number.MIN_VALUE : Number.MAX_VALUE
        let rewardBStock = b?.quantity === 0 ? Number.MIN_VALUE : Number.MAX_VALUE

        let stockDiff = rewardBStock - rewardAStock

        //If the stock status is the same, sort by name
        if (stockDiff === 0) {
          return rewardAName > rewardBName ? 1 : rewardBName > rewardAName ? -1 : 0
        }

        return stockDiff
      })
  }
}
