export const getPropsMovieData = (props) => {
  let result;
  if (props.data.Search != undefined || props.data.Search != null) {
    const arr = props.data.Search;

    // remove duplicates
    result = [...new Map(arr.map((item) => [item.imdbID, item])).values()];
  } else {
    result = [props.data];
  }

  return result;
};

export const addSelectedFromUser = (arr1, arr2) => {
  if (arr1 && arr2) {
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i].imdbID === arr2[j].imdbID) {
          arr1[i].selected = true;
        }
      }
    }
    return arr1;
  } else {
    return arr1;
  }
};

export const addSelectedKey = (arr1) => {
  if (arr1 != null || arr1 != undefined) {
    for (let i = 0; i < arr1.length; i++) {
      arr1[i].selected = true;
    }
  }

  return arr1;
};

export const countSelected = (arr1) => {
  let res = arr1.reduce(function (obj, v) {
    obj[v.selected] = (obj[v.selected] || 0) + 1;
    return obj;
  }, {});

  if (res.true === null || res.true === 0 || res.true === undefined) {
    res.true = 0;
  }
  return res.true;
};
