// 正式部署请设置为false
const isDev = false;
const showLog = true;
const appVersion = 'v0.8.8';

const apiInfo = {
  domain: isDev ? "http://localhost:4000" : "https://api.maodouketang.com",
  prefix: "/api/v1",
  users: "/users",
  courses: "/courses",
  classes: "/classes",
  reminders: "/reminders",
  system: "/system",
  roles: "/roles"
};

// apis
const api = {
  user: {
    login: {
      method: "POST",
      url: apiInfo.users
    },
    userInfo: {
      method: "GET",
      url: apiInfo.users + "/"
    },
    getPhone: {
      method: "POST",
      url: apiInfo.users + "/"
    },
    // 格式/:user_id/classes
    getUserClass: {
      method: "GET",
      url: apiInfo.users + "/"
    },
    updateProfile: {
      method: "PUT",
      url: apiInfo.users + "/"
    },
    fetchOwnedCourse: {
      method: "GET",
      url: apiInfo.users + "/"
    },
    getInvitees: {
      method: "GET",
      url: apiInfo.users + "/"
    },
  },
  classes: {
    getClassInfo: {
      method: "GET",
      url: apiInfo.classes + "/"
    },
  },
  roles: {
    joinCourse: {
      method: "POST",
      url: apiInfo.roles + "/"
    },
  },
  reminders: {
    getReminder: {
      method: "GET",
      url: apiInfo.reminders + "/"
    },
  },
  courses: {
    courseTheme: {
      method: "GET",
      url: apiInfo.courses + "/theme"
    },
    courseList: {
      method: "GET",
      url: apiInfo.courses + "/"
    },
    newCourse: {
      method: 'POST',
      url: apiInfo.courses + "/"
    },
    getCourseInfo: {
      method: "GET",
      url: apiInfo.courses + "/"
    },
    getCourseJoinedUsers: {
      method: "GET",
      url: apiInfo.courses + "/"
    },
    deleteCourse: {
      method: 'DELETE',
      url: apiInfo.courses + "/"
    }
  },
  system: {
    addFormId: {
      method: "POST",
      url: apiInfo.system + "/formId"
    }
  }
};

function logger(msg, ...args) {
  showLog && console.log(msg, ...args);
}

module.exports = {
  logger,
  isDev,
  appVersion,
  api: disposeUrl(api, apiInfo.domain + apiInfo.prefix)
};

function disposeUrl(obj, prefix) {
  Object.keys(obj).forEach(v => {
    if (obj[v].url) {
      obj[v].url = prefix + obj[v].url;
    } else {
      obj[v] = disposeUrl(obj[v], prefix);
    }
  });
  return obj;
}