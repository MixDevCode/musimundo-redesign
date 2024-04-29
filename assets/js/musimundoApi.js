function getExpirationFromToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    if (payload.exp) {
      return payload.exp;
    } else {
      console.error("Token does not have an expiration time (exp claim).");
      return null;
    }
  } catch (error) {
    console.error("Error decoding or parsing the token:", error);
    return null;
  }
}

// Musimundo API

const baseURL = "https://musipago.grupocarsa.com/api";
const musiApi = axios.create({
  baseURL: baseURL,
});

// Functions
async function login() {
  try {
    const username = $("#email").val();
    const password = $("#password").val();
    musiApi
      .post("/login", {
        username,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = "dashboard.html";
          // Set cookie
          const expirationInSeconds = getExpirationFromToken(
            response.data.token
          );

          if (expirationInSeconds !== null) {
            Cookies.set("token", response.data.token, {
              expires: new Date(expirationInSeconds * 1000),
            })
          }
        }
      });
  } catch (error) {
    if (error?.response?.status === 401) {
      alert(
        "Error",
        "Credenciales incorrectas.\n\nPor favor, verifique sus datos y vuelva a intentarlo."
      );
    }
  }
}

async function userDetails() {
  try {
    const token = Cookies.get("token");
    const { data: userDetails } = await musiApi.get("/userDetails", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (userDetails) {
      return userDetails;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "login.html";
    }
    console.error("Error fetching user details:", error);
  }
}

async function getLastResumen() {
  try {
    const token = Cookies.get("token");
    const dni = await userDetails(token).dni;
    const response = await musiApi.get("/getExpiry?dni=" + dni, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data[0];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "login.html";
    } else {
      console.error("An error occurred:", error);
    }
  }
}

async function getResumenes() {
  try {
    const token = Cookies.get("token");
    const dni = await userDetails(token).dni;
    const summaries = await musiApi.get("/userSummaries?dni=" + dni, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if(summaries.status === 200) {
      return summaries.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "login.html";
    } else {
      console.error("An error occurred:", error);
    }
  }
}

async function getExtendedDetails() {
  try {
    const token = Cookies.get("token");
    const userData = await userDetails();
    const response = await musiApi.get("/getAccount?dni=" + userData.dni, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if(response.status === 200) {
      response.data.user = userData;
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "login.html";
    } else {
      console.error("An error occurred:", error);
    }
  }
}

async function getDisponibles() {
  try {
    const token = Cookies.get("token");
    const dni = await userDetails(token).dni;
    const response = await musiApi.get("/getAccount?dni=" + dni, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if(response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "login.html";
    } else {
      console.error("An error occurred:", error);
    }
  }
}

async function getSucursales() {
  try {
    const token = Cookies.get("token");
    userDetails(token);
    const response = await musiApi.get("/sucursales/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if(response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "login.html";
    } else {
      console.error("An error occurred:", error);
    }
  }
}


function logout() {
  Cookies.remove("token");
  window.location.href = "index.html";
}