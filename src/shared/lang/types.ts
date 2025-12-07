export type LangCode = "en" | "ja" | "fr" | "de" | "it" | "es" | "zh";

export interface BaseLang {
  meta: {
    title: string;
    description: string;
    appTitle: string;
  };
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
    skipLink: string;
    closeMenu: string;
    openMenu: string;
    tryAgain: string;
    reload: string;
    clear: string;
    close: string;
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
      notes: string;
      heroSub: string;
      heroNote: string;
      highlightTitle: string;
      highlightItems: string[];
      stats: {
        entries: string;
        decisions: string;
        actionItems: string;
        nextMeeting: string;
      };
      sidebarTitle: string;
      sidebarDescription: string;
      sidebarChecks: string[];
      sidebarCTA: string;
      sidebarCTANote: string;
    };
    houseRules: {
      eyebrow: string;
      title: string;
      description: string;
      loading: string;
      effectiveFrom: string;
      heroSub: string;
      heroNote: string;
      focusTitle: string;
      focusItems: string[];
      stats: {
        rules: string;
        categories: string;
        quietHours: string;
        review: string;
      };
      quietHoursValue: string;
      reviewValue: string;
      sidebarTitle: string;
      sidebarDescription: string;
      sidebarChecks: string[];
      sidebarContact: string;
      sidebarContactNote: string;
      viewDetails: string;
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
      allEvents: string;
      viewDetails: string;
      backToEvents: string;
      location: string;
      date: string;
      tags: string;
      noDescription: string;
      heroStats: {
        upcoming: string;
        past: string;
        thisMonth: string;
      };
    };
    accounting: {
      eyebrow: string;
      title: string;
      description: string;
      loading: string;
      dashboard: string;
      history: string;
      totalBalance: string;
      recentTrend: string;
      income: string;
      expense: string;
      noData: string;
      noDataDescription: string;
      monthsOfData: string;
      selectMonth: string;
      latest: string;
      year: string;
      month: string;
      surplus: string;
      errorOccurred: string;
      totalIncome: string;
      totalExpense: string;
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
        descriptionRequired: string;
        amountRequired: string;
      };
      selectMonthPrompt: string;
      accessDenied: string;
      accessDeniedDescription: string;
      backToAccounting: string;
      newEntry: string;
      registered: string;
      addIncome: string;
      addExpense: string;
      categories: string[];
    };
    login: {
      subtitle: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      errorMessage: string;
      signingIn: string;
      signInButton: string;
    };
    profileEdit: {
      title: string;
      description: string;
      loading: string;
      errorTitle: string;
      notFound: string;
      notFoundMessage: string;
      backLink: string;
      photoHint: string;
      breadcrumbHome: string;
      breadcrumbEdit: string;
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
      nickname: string;
      fullName: string;
      moveIn: string;
      moveOut: string;
      notSet: string;
      heroSub: string;
      statusActive: string;
      statusMovingOut: string;
      stayLength: string;
      daysUntilMoveOut: string;
      bioTitle: string;
      bioEmpty: string;
      roleLabels: {
        admin: string;
        accounting_admin: string;
        resident: string;
      };
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
      effectiveFrom: string;
    };
    events: {
      countLabel: (count: number) => string;
      upcoming: string;
      past: string;
      daysUntil: (days: number) => string;
      daysAgo: (days: number) => string;
      today: string;
      tomorrow: string;
      yesterday: string;
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
        incomePercent: (percent: number) => string;
        expensePercent: (percent: number) => string;
      };
      transactions: {
        title: string;
        date: string;
        method: string;
        description: string;
        category: string;
        amount: string;
        noRecords: string;
        paypay: string;
        cash: string;
        count: (count: number) => string;
        noMatch: string;
        clearFilter: string;
        close: string;
        search: string;
      };
    };
    floorPlan: {
      loading: string;
      roomTitlePrefix: string;
      roomNumberLabel: string;
      floorLabel: string;
    };
    profileForm: {
      saving: string;
      saved: string;
      saveButton: string;
      successTitle: string;
      redirecting: string;
      nicknameLabel: string;
      nicknamePlaceholder: string;
      fullNameLabel: string;
      fullNamePlaceholder: string;
      bioLabel: string;
      bioPlaceholder: string;
      roomNumber: string;
      floor: string;
      errorMessage: string;
    };
  };
  footer: {
    sections: {
      navigation: string;
      resources: string;
      community: string;
    };
    brandDescription: string;
    communityJoin: string;
    residentsCount: string;
    copyright: string;
    social: {
      slack: string;
      discord: string;
      instagram: string;
    };
  };
}
