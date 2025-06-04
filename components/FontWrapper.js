import React from 'react';
import PropTypes from 'prop-types';

const FontWrapper = ({ children, font, size, weight, style, color }) => {
  const fontStyle = {
    fontFamily: font,
    fontSize: size,
    fontWeight: weight,
    fontStyle: style,
    color: color,
  };

  return <div style={fontStyle}>{children}</div>;
};

FontWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  font: PropTypes.string.isRequired,
  size: PropTypes.string,
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.string,
  color: PropTypes.string,
};

FontWrapper.defaultProps = {
  size: 'inherit',
  weight: 'normal',
  style: 'normal',
  color: 'inherit',
};

export default FontWrapper;
