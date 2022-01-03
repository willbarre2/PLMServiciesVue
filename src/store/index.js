import { createStore } from 'vuex'

export default createStore({
  state: {
    connectState: true,
    adminState: false,
    prefsInfo: [],
    showPassChgeStore: false,
    showStateChgeStore: false,
    showHelpMailStore: false,
    showDeleteEmailStore: false,
    showChgeShellStore: false,
    showChgeContactMailStore: false,
    showHelpAccountStore: false,
    showNewAccountStore: false,
    showDeleteAccountStore: false,
    showStatusAccountStore: false,
    showMoveAccountStore: false,
    showPendingAccountStore: false,
    showVPNUnitStore: false,
    showVPNUserStore: false,
    showAlertStore: false,
    showInvitHelpStore: true,
    deleteMail: "",
    newShellStore: "",
    newStateStore: "",
    oldStateStore: false,
    newContactMailStore: "",
    favActivated: false,
    lang: "fr",
    langKey: 0,
    stateKey: 0,
    newPersonKey: 0,
    msgAlert: "",
  },
  mutations: {
    SETCONNECTSTATESTORE(state, new_val){
      state.connectState = new_val;
    },

    SETADMINSTATESTORE(state, new_val){
      state.adminState = new_val;
    },

    SETPREFSINFOSTORE(state, new_val){
      state.prefsInfo = new_val;
    },

    SETSHOWPASSCHGESTORE(state, new_val){
      state.showPassChgeStore = new_val;
    },

    SETSHOWSTATECHGESTORE(state, new_val){
      state.showStateChgeStore = new_val;
    },

    SETSHOWHELPMAILSTORE(state, new_val){
      state.showHelpMailStore = new_val;
    },

    SETSHOWDELETEMAILSTORE(state, new_val){
      state.showDeleteEmailStore = new_val;
    },

    SETSHOWCHGESHELLSTORE(state, new_val){
      state.showChgeShellStore = new_val;
    },

    SETSHOWCHGECONTACTMAILSTORE(state, new_val){
      state.showChgeContactMailStore = new_val;
    },

    SETSHOWHELPACCOUNTSTORE(state, new_val){
      state.showHelpAccountStore = new_val;
    },

    SETSHOWNEWACCOUNTSTORE(state, new_val){
      state.showNewAccountStore = new_val;
    },

    SETSHOWDELETEACCOUNTSTORE(state, new_val){
      state.showDeleteAccountStore = new_val;
    },

    SETSHOWSTATUSACCOUNTSTORE(state, new_val){
      state.showStatusAccountStore = new_val;
    },

    SETSHOWMOVEACCOUNTSTORE(state, new_val){
      state.showMoveAccountStore = new_val;
    },

    SETSHOWPENDINGACCOUNTSTORE(state, new_val){
      state.showPendingAccountStore = new_val;
    },

    SETSHOWVPNUNITSTORE(state, new_val){
      state.showVPNUnitStore = new_val;
    },
    
    SETSHOWVPNUSERSTORE(state, new_val){
      state.showVPNUserStore = new_val;
    },

    SETSHOWALERTSTORE(state, new_val){
      state.showAlertStore = new_val;
    },

    SETSHOWINVITHELPSTORE(state, new_val){
      state.showInvitHelpStore = new_val;
    },

    SETNEWSHELLSTORE(state, new_val){
      state.newShellStore = new_val;
    },

    SETNEWSTATESTORE(state, new_val){
      state.newStateStore = new_val;
    },

    SETOLDSTATESTORE(state, new_val){
      state.oldStateStore = new_val;
    },

    SETNEWCONTACTMAILSTORE(state, new_val){
      state.newContactMailStore = new_val;
    },

    SETDELETEMAILSTORE(state, new_val){
      state.deleteMail = new_val;
    },

    SETFAVACTIVATED(state){
      state.favActivated = !state.favActivated;
    },

    SETFAVACTIVATEDFALSE(state){
      state.favActivated = false;
    },

    SETLANGSTORE(state, new_val){
      state.lang = new_val;
    },

    SETLANGKEY(state){
      state.langKey += 1;
    },

    SETSTATEKEY(state){
      state.stateKey += 1;
    },

    SETNEWPERSONKEY(state){
      state.newPersonKey += 1;
    },

    SETMSGALERTSTORE(state, new_val){
      state.msgAlert = new_val;
    },
  },
  actions: {
  },
  modules: {
  }
})
