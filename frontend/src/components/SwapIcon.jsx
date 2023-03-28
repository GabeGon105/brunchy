const SwapIcon = ({ filter, swapOn, swapOff, click }) => (
  <label
    className={`swap swap-rotate ${filter ? "swap-active" : ""}`}
    onClick={click}
  >
    {/* On Icon */}
    {swapOn}

    {/* Off Icon */}
    {swapOff}
  </label>
);

export default SwapIcon;
