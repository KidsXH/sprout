'use client'

import {Provider} from 'react-redux'
import {store} from '@/store'
import {PropsWithChildren} from "react";

export const Providers = (props: PropsWithChildren) => {
  return <Provider store={store}>{props.children}</Provider>
}