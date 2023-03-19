const SwapIcon = ({ filter, swapOn, swapOff, click }) => (
  <label
    className={`swap swap-rotate ${filter ? "swap-active" : ""}`}
    onClick={click}
  >
    {/* this hidden checkbox controls the state */}
    {/* <input type="checkbox" /> */}

    {/* On Icon */}
    {swapOn}

    {/* Off Icon */}
    {swapOff}
  </label>
);

export default SwapIcon;
