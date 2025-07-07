import dogImage from "../../assets/images/dog.jpg";

/*
classWithScheduleDtos : [{
                classId : 1,
                name : "웹 / 앱",
                cohort : "2기",
                schedules: [            
                    id : 1,
                    subjectName : "웹 / 앱",
                    startDate : "2025-05-01",
                    endDate : "2025-10-31",
                    classDesc : "웹 / 앱 개발 클래스",
                    classUrl : "https://www.google.com"
                ]
}]

instructor : [{
                "email": "dwc071092@naver.com",
                "name": "오창은",
                "birth": "2025-06-23",
                "gender": "남성",
                "phone": "01012345678",
                "address": "",
                "profileImage": null,
                "classId": 5,
                "position": "강사"
}]
*/

const allClassFetch = async (token) => {
  const requestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const url = new URL(`${import.meta.env.VITE_ORGANIZATION_API_URL}/init`);

  const response = await fetch(url, requestInit);

  if (200 <= response.status && response.status < 300) {
    const responseJson = await response.json();
    return responseJson.data;
  } else {
    const errorStatus = response.json().status;
    const errorMessage = response.json().message;
    throw new Error(`${errorStatus} : ${errorMessage}`);
  }
};

const singleClassFetch = async (id, token) => {
  const requestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const url = new URL(
    `${import.meta.env.VITE_ORGANIZATION_API_URL}/class/${id}`
  );

  const response = await fetch(url, requestInit);

  if (200 <= response.status && response.status < 300) {
    const responseJson = await response.json();
    return responseJson.data;
  } else {
    const errorStatus = response.json().status;
    const errorMessage = response.json().message;
    throw new Error(`${errorStatus} : ${errorMessage}`);
  }
};

export { allClassFetch, singleClassFetch };
