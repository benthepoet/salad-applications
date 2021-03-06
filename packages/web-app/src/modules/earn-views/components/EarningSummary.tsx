import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SectionHeader, StatElement } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { formatBalance } from '../../../utils'
import { BonusEarningRate } from '../../bonus/models'

const styles = (theme: SaladTheme) => ({
  container: {},
  row: {
    paddingTop: 20,
    display: 'flex',
    justifyContent: 'space-around',
  },
  title: {
    fontFamily: theme.fontGroteskBook25,
    textTransform: 'uppercase',
    fontSize: 10,
    color: theme.lightGreen,
    letterSpacing: '1px',
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  lifetimeBalance?: number
  totalXp?: number
  bonusEarningRate?: BonusEarningRate
}

class _EarningSummary extends Component<Props> {
  render() {
    const { currentBalance, lifetimeBalance, totalXp, bonusEarningRate, classes } = this.props

    return (
      <div className={classes.container}>
        <SectionHeader>Summary</SectionHeader>
        <div className={classes.row}>
          <StatElement
            title={'Current Balance'}
            values={[formatBalance(currentBalance)]}
            infoText={'Current balance available to spend'}
          />
          <StatElement
            title={'Lifetime Balance'}
            values={[formatBalance(lifetimeBalance)]}
            infoText={'Total balance earned'}
          />
          <StatElement
            title={'Total XP'}
            values={[Math.round(totalXp || 0).toLocaleString() || '0']}
            infoText={`XP stands for "Experience Points". You are awarded 1 XP per minute of confirmed mining time. The more XP you have, the more veggies you will unlock in the Pantry.`}
          />
          {bonusEarningRate && (
            <StatElement
              title={'Earning Bonus'}
              values={[`${Math.round(bonusEarningRate?.multiplier || 0).toLocaleString()}x`]}
              infoText={`You are currently earning ${
                bonusEarningRate.multiplier
              }x your normal earning rate. You have already earned ${formatBalance(
                bonusEarningRate.earnedAmount,
              )}/${formatBalance(bonusEarningRate.earnedAmountLimit)} of your bonus amount`}
            />
          )}
        </div>
      </div>
    )
  }
}

export const EarningSummary = withStyles(styles)(_EarningSummary)
