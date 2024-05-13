function Loading() {
    return(
    <div className=' flex flex-col justify-center items-center content-center '>
    <svg   width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#242565" strokeWidth="4" strokeDasharray="280" strokeDashoffset="140">
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="stroke-dashoffset" from="280" to="70" begin="0s" dur="1.5s" repeatCount="indefinite" keyTimes="0;1" keySplines="0.1 0.2 0.3 1" calcMode="spline"/>
    </circle>
    </svg>
    <p> Loading ...</p>
    </div>
    );
  }
  
  export default Loading;
  