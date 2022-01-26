<template>
  <div class="cal-wrapper text-center">
    <div class="cal-header">
      <div class="l" @click="preMonth">
        <div class="arrow-left icon"></div>
      </div>
      <div class="title header-lg">{{ curYearMonth }}</div>
      <div class="r" @click="nextMonth">
        <div class="arrow-right icon"></div>
      </div>
    </div>
    <div class="cal-body">
      <div class="weeks">
        <span
          v-for="(dayName, dayIndex) in i18n[calendar.options.locale].dayNames"
          class="item"
          :key="dayIndex"
          >
          {{ i18n[calendar.options.locale].dayNames[(dayIndex + calendar.options.weekStartOn) % 7] }}
        </span>
      </div>
      <div class="dates" >
        <div
          v-for="date in dayList"
          class="item"
          :class="[{
            today: date.status ? (today == date.date) : false,
            event: date.status ? (date.title != undefined) : false,
            [calendar.options.className] : (date.date == selectedDay)
          }, ...date.customClass]"
          :key="date.date"
          @click="handleChangeCurday(date)"
          >
          <p class="date-num">
            {{ date.status ? date.date.split('/')[2] : '&nbsp;' }}
          </p>
          <span v-if="date.status ? (today == date.date) : false" class="is-today"></span>
          <span
            v-if="date.status ? (date.title != undefined) : false"
            class="is-event"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '../i18n.js'
import { dateTimeFormatter, isEqualDateStr } from '../tools.js'

// const inBrowser = typeof window !== 'undefined'
export default {
  name: 'cal-panel',
  data () {
    return {
      i18n
    }
  },
  props: {
    events: {
      type: Array,
      required: true
    },
    calendar: {
      type: Object,
      required: true
    },
    selectedDay: {
      type: String,
      required: false
    }
  },
  computed: {
    dayList () {
      const firstDay = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1)
      let dayOfWeek = firstDay.getDay()
      // 根据当前日期计算偏移量 // Calculate the offset based on the current date
      if (this.calendar.options.weekStartOn > dayOfWeek) {
        dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn + 7
      } else {
        dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn
      }

      const startDate = new Date(firstDay)
      startDate.setDate(firstDay.getDate() - dayOfWeek)

      let item
      let _status
      const tempArr = []
      let tempItem
      for (let i = 0; i < 42; i++) {
        item = new Date(startDate)
        item.setDate(startDate.getDate() + i)

        if (this.calendar.params.curMonth === item.getMonth()) {
          _status = 1
        } else {
          _status = 0
        }
        tempItem = {
          date: `${item.getFullYear()}/${item.getMonth() + 1}/${item.getDate()}`,
          status: _status,
          customClass: []
        }
        this.events.forEach((event) => {
          if (isEqualDateStr(event.date, tempItem.date)) {
            tempItem.title = event.title
            tempItem.desc = event.desc || ''
            if (event.customClass) {
              tempItem.customClass.push(event.customClass)
            }
          }
        })
        tempArr.push(tempItem)
      }
      return tempArr
    },
    today () {
      const dateObj = new Date()
      return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
    },
    curYearMonth () {
      const tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth + 1}/01`))
      return dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format, this.i18n[this.calendar.options.locale].monthNames)
    },
    customColor () {
      return this.calendar.options.color
    }
  },
  methods: {
    nextMonth () {
      this.$EventCalendar.nextMonth()
      const param = {
        prev: false,
        next: true,
        curYearMonth: this.curYearMonth
      }
      this.$emit('month-changed', param)
    },
    preMonth () {
      this.$EventCalendar.preMonth()
      const param = {
        prev: true,
        next: false,
        curYearMonth: this.curYearMonth
      }
      this.$emit('month-changed', param)
    },
    handleChangeCurday (date) {
      if (date.status) {
        this.$emit('cur-day-changed', date.date)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/css/variables/color-palette.scss';
  .weeks,
  .dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 24px;
  }
  .weeks {
    font-size: 17px;
    text-align: center;
    margin: 1.4vmax 0;
  }
  .dates {
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 75px;
      max-height: 8.6vh;
      text-align: center;
      border: 2px solid #{$neutral-900-20};
      cursor: default;
      font-size: 35px;
      color: #{$neutral-200};
      &.event {
        cursor: pointer;
        color: #{$neutral-700};
        &:hover {
          background-color: #{$accent_b-50};
        }
      }
      &.selected-day {
        border: 2px solid #{$accent_b-500};
        color: #{$accent_b-500};
      }
    }
  }
  .cal-header {
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
    width: 250px;
    .icon {
      position: relative;
      width: 18px;
      height: 18px;
      border: 1px solid #000;
      border-radius: 2px;
      box-shadow: 0 0 0 0px #000;
      cursor: pointer;
      &::before {
        content: " ";
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        bottom: 0;
        margin: auto;
        width: 6px;
        height: 6px;
        border-top: 1px solid;
        border-right: 1px solid;
      }
      &.arrow-left::before {
        transform: rotate(-135deg);
        left: 4px;
      }
      &.arrow-right::before {
        transform: rotate(45deg);
        right: 4px;
      }
    }
  }
</style>
