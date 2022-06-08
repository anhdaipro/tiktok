import React,{useState,useEffect,useRef,useCallback,useMemo} from 'react'

function Entry(props){
  const {
    mention,
    theme,
    searchValue, 
    isFocused,
    ...parentProps
  } = props;

  console.log(mention)
  return (
    <div {...parentProps} >
      <div key={mention.id} key={mention.username} class="jsx-1498925541 container">
        {mention.username!=undefined?<>
        <img src={mention.picture} class="jsx-1498925541 avatar"/>
        <div class="jsx-1498925541 user-info">
          <div class="jsx-1498925541 name">{mention.name}</div>
          <div class="jsx-1498925541 user-id">@{mention.username}</div>                                              
        </div></>: <div class="jsx-1498925541 name">{mention.name}</div>}
      </div>
    </div>
  );
}

export default Entry