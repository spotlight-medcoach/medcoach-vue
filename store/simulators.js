export const state = () => ({
  block: 1,
  caseId: null,
  caseIndex: -1,
  simulator: null,
  timeBlock1: 18060000, // 5 hrs
  timeBlock2: 16260000 //  4.4 hrs
})

export const mutations = {
  setBlock (state, payload) {
    state.block = payload
  },
  setSimulator (state, payload) {
    state.simulator = payload
  }
}
