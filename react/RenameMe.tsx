import React from 'react';
import { useState, useEffect } from 'react';
import { CSSProperties } from 'react';

interface RenameMeProps {
  nameToGreet: string
}

const RenameMe: StorefrontFunctionComponent<RenameMeProps> = ({ nameToGreet }) => {

  // Do a global project find and replace for RenameMe and renameme before starting development --

  const h1Style: CSSProperties = {
    textAlign: "center",
    fontSize: "3rem"
  }

  return (
    <>
      <h1 style={h1Style}>Hello {nameToGreet || "World"}!</h1>
    </>
  )
}

RenameMe.schema = {
  title: 'editor.renameme.title',
  description: 'editor.renameme.description',
  type: 'object',
  properties: {
    nameToGreet: {
      title: "Name",
      description: "Who are we greeting?",
      type: "string",
      default: "Erik"
    }
  }
}

export default RenameMe
