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
