import React from 'react';
import {Link} from 'react-router-dom';

const Nav = () => (
	<nav id='navbar'>
	  <ul>
		<Link to='/'><li>Rotating weight weight</li></Link>
		<Link to='/climbing_calculator'><li>Climbing calculator</li></Link>
	  </ul>
	</nav>
  );

export default Nav;