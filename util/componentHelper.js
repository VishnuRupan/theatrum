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
