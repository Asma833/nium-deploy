
const useDisableBackButton = () => {
   
    const disableBackButton = () => {
     
      window.history.pushState(null, '', window.location.href);
      
    };
    disableBackButton();

};

export default useDisableBackButton;
