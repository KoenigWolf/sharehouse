export type LangCode = "en" | "ja" | "fr" | "de" | "it" | "es" | "zh";

export interface BaseLang {
  nav: {
    residents: string;
    meetings: string;
    events: string;
    houseRules: string;
    accounting: string;
    accountingAdmin: string;
    notices: string;
    settings: string;
    editProfile: string;
    more: string;
  };
  common: {
    loading: string;
    errorPrefix: string;
    attendees: string;
    viewOriginal: string;
    emptyCell: string;
    notFound: string;
  };
  pages: {
    home: {
      eyebrow: string;
      title: string;
      titleAccent: string;
      subtitle: string;
      residentsLabel: string;
      vacantLabel: string;
      moveInsLabel: string;
      moveOutsLabel: string;
      errorTitle: string;
      errorMessage: string;
    };
    meetings: {
      eyebrow: string;
      title: string;
      description: string;
      loading: string;
    };
    houseRules: {
      eyebrow: string;
      title: string;
      description: string;
      loading: string;
    };
    events: {
      eyebrow: string;
      title: string;
      description: string;
      loading: string;
      upcomingTitle: string;
      upcomingEmpty: string;
      pastTitle: string;
      pastEmpty: string;
    };
    accounting: {
      eyebrow: string;
      title: string;
      description: string;
      loading: string;
    };
    accountingAdmin: {
      eyebrow: string;
      title: string;
      description: string;
      selectMonthTitle: string;
      selectMonthDescription: string;
      form: {
        date: string;
        amount: string;
        type: string;
        income: string;
        expense: string;
        method: string;
        paypay: string;
        cash: string;
        category: string;
        description: string;
        descriptionPlaceholder: string;
        submit: string;
      };
      selectMonthPrompt: string;
      accessDenied: string;
      accessDeniedDescription: string;
      backToAccounting: string;
    };
    notices: {
      eyebrow: string;
      title: string;
      description: string;
    };
    settings: {
      eyebrow: string;
      title: string;
      description: string;
      language: string;
      languageDesc: string;
      saved: string;
      dataSource: string;
      mockMode: string;
      liveMode: string;
      applyNote: string;
      theme: string;
      themeDesc: string;
      themeLight: string;
      themeDark: string;
      themeSystem: string;
    };
    residentDetail: {
      backToList: string;
      loading: string;
      floor: string;
      room: string;
      moveIn: string;
      moveOut: string;
      notSet: string;
    };
  };
  components: {
    residentGrid: {
      searchPlaceholder: string;
      searchResult: (count: number) => string;
      emptyTitle: string;
      emptyDescriptionSearch: string;
      emptyDescriptionDefault: string;
      clearFilters: string;
    };
    residentCard: {
      roomLabel: string;
      moveIn: string;
      moveOut: string;
    };
    meetingNotes: {
      decisions: string;
      actions: string;
      attendees: string;
    };
    houseRules: {
      categories: {
        living: string;
        cleaning: string;
        noise: string;
        safety: string;
        other: string;
      };
    };
    events: {
      countLabel: (count: number) => string;
    };
    accounting: {
      status: {
        surplus: string;
        deficit: string;
      };
      summary: {
        income: string;
        expense: string;
        balance: string;
      };
      transactions: {
        date: string;
        method: string;
        description: string;
        category: string;
        amount: string;
        noRecords: string;
        paypay: string;
        cash: string;
      };
    };
    floorPlan: {
      loading: string;
      roomTitlePrefix: string;
      roomNumberLabel: string;
      floorLabel: string;
    };
  };
}
