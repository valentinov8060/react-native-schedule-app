const handleInput = (setter, name, value) => {
  setter(prevValue => ({
    ...prevValue,
    [name]: value
  }));
};

export{
  handleInput
}