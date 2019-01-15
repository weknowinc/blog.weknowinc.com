import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import './style.scss';
import Button from '@weknow/gatsby-theme-drupal-boina/src/components/atoms/button';

const Header = ({
  scrolled, isMobile, showSidebar, darkMenu
}) => (
  <div className="grid-x align-middle c-header">
    {(!scrolled && isMobile)
      ? (
        <div className="c-header__normal cell grid-container align-right grid-x">
          <div className="cell grid-x small-12 medium-9 large-7 xlarge-6 xxlarge-6 align-right grid-x">
            <div className={`cell small-3 medium-2 grid-x align-center ${darkMenu ? 'c-header__menu--dark' : ''}`}><Link className="c-header__menu-link" to="/">Home</Link></div>
            <div className={`cell small-3 medium-2 grid-x align-center ${darkMenu ? 'c-header__menu--dark' : ''}`}><Link className="c-header__menu-link" to="/about">About me</Link></div>
            <div className={`cell small-6 medium-4 grid-x align-center ${darkMenu ? 'c-header__menu--dark' : ''}`}><a className="c-header__menu-link c-header__menu-link--cta" href="https://weknowinc.com/contact" target="_blank" rel="noopener noreferrer">Partner with weKnow</a></div>
          </div>
        </div>
      )
      : (
        <div className="c-header__scrolled grid-x align-middle">
          <div className="cell grid-container grid-x align-middle">
            <Link to="/" className="c-header__logo__link">
              <svg className="c-header__logo" width="100" viewBox="229.31500244140625 55.547000885009766 202.08700561523438 114.16500091552734" xmlns="http://www.w3.org/2000/svg">
                <path d="M 229.315 99.334 L 238.567 99.334 L 257.492 155.477 L 277.047 99.124 L 286.51 99.124 L 305.855 153.585 L 325.2 99.124 L 334.242 99.334 L 310.902 169.306 L 299.757 169.355 L 282.515 115.105 L 262.749 169.293 L 252.235 169.355 L 229.315 99.334 Z" />
                <path d="M 343.509 167.748" />
                <path d="M 342.554 168.226" />
                <path d="M 342.244 169.117 L 366.317 169.118 L 366.02 138.507 L 374.935 127.808 L 400.494 169.712 L 431.55 169.712 L 391.281 111.462 L 423.08 79.366 L 391.875 79.069 L 366.317 106.113 L 365.722 55.59 C 355.974 54.902 343.773 62.524 343.73 72.53 L 342.244 169.117 Z" />
                <path d="M 345.513 67.775" />
              </svg>
              <span>home</span>
            </Link>
            <div className="cell auto grid-x align-middle align-right">
              <Button link onClick={showSidebar}>
                <svg className="c-header__menu-handler" viewBox="261.53900146484375 145.27000427246094 97.40499877929688 75.30599975585938" xmlns="http://www.w3.org/2000/svg" xmlnsbx="https://boxy-svg.com">
                  <path d="M 271.21 166.04 C 258.537 165.855 257.814 145.297 272.052 145.27 L 349.238 145.27 C 362.366 145.219 361.991 166.536 349.238 166.601 L 271.21 166.04 Z" />
                  <path d="M 271.327 193.058 C 258.236 193.153 258.175 172.32 271.962 172.288 L 333.333 172.288 C 346.511 172.231 346.796 193.547 333.368 193.619 L 271.327 193.058 Z" transform="matrix(0.999998, 0.00207, -0.00207, 0.999998, 0.376693, -0.688812)" bxorigin="0.873 0.438" />
                  <path d="M 270.629 219.998 C 258.692 220.37 258.234 199.264 271.105 199.228 L 317.107 199.228 C 329.316 199.168 328.571 220.486 317.133 220.559 L 270.629 219.998 Z" transform="matrix(0.999998, 0.00207, -0.00207, 0.999998, 0.432427, -0.657421)" bxorigin="0.873 0.438" />
                </svg>
                <span>menu</span>
              </Button>
            </div>
          </div>
        </div>
      )}
  </div>
);

Header.propTypes = {
  scrolled: PropTypes.bool,
  showSidebar: PropTypes.func,
  darkMenu: PropTypes.bool,
  isMobile: PropTypes.bool
};

Header.defaultProps = {
  scrolled: false,
  showSidebar: null,
  darkMenu: false,
  isMobile: false
};

export default Header;
