/** @jsx jsx */
import React from 'react'
import { jsx } from "theme-ui";
import { Router, Link } from "@reach/router"
import { hsluvToHex, hpluvToHex, hexToHsluv, hexToHpluv } from "hsluv";
import HexInput from '../components/hex-input'

let Dash = () => <div>Dash</div>

export default () => (
  <Router basepath="/app">
    <HexInput path="/" />
    <Dash path="dashboard" />
  </Router>
)