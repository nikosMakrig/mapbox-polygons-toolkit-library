import React from "react";
import PropTypes from "prop-types";

const defaultStyle = {
  width: '96px',
  background: '#3c4faf87',
  position: 'absolute',
  fontSize: '14px',
  height: '34px',
  borderRadius: '14px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  right: '10px',
  cursor: 'pointer',
  top: '30px'
};

export const SelectArea = ({ handleClick }) => (
  <div style={defaultStyle} className='button'
       onClick={handleClick}>
    <span>Select Area</span>
  </div>
);

SelectArea.propTypes = {
  handleClick: PropTypes.func
};
