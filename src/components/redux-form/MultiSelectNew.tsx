import React from 'react'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { renderFormHelper } from './FormHelper'
import { Box, InputLabel } from '@mui/material'
import Chip from '@mui/material/Chip'
// import Stack from '@mui/material/Stack'

export const renderMultiSelectNewField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}: any) => {
  const tmpArr: Array<string> = input.value
    ? input.value.map((v: any) =>
        typeof v === 'object'
          ? (JSON.stringify(v) as string)
          : ((v as unknown) as string)
      )
    : []
  const tmp = tmpArr.map((v) => JSON.parse(v)) //.filter((v,_,arr)=>v.)

  const tmp2 = tmp.reduce<Array<any>>(
    (acc, item) =>
      acc.find((v) => v.id === item.id) === undefined ? [...acc, item] : acc,
    []
  )

  //   const value = [...new Set(tmp_arr)]
  const value = tmp2
    ? tmp2.map((v: any) => (typeof v === 'object' ? JSON.stringify(v) : v))
    : []

  const handleDelete = (id: number) => {
    // console.log('CURRENT ROLES ', id, input.value, value)

    const res = value
      .map((v: any) => (typeof v !== 'object' ? JSON.parse(v) : v))
      .filter((v: any) => typeof v === 'object' && v.id !== id)
    console.log(
      'Applied roles...',
      res.map((v: any) => JSON.stringify(v))
    )
    // input.onChange(JSON.stringify(res))
    input.onChange(res.map((v: any) => JSON.stringify(v)))
    input.checkValidity()
  }

  return (
    <FormControl
      error={touched && error}
      sx={{
        width: '100%',
      }}
    >
      <InputLabel id="multi-select" {...custom}>
        {label}
      </InputLabel>
      <Select
        labelId="multi-select"
        id="multi-select"
        label={label}
        placeholder={label}
        {...input}
        {...custom}
        fullWidth
        multiple
        value={value}
      >
        {children}
      </Select>
      {/* <Stack spacing={0.75} direction="row" sx={{ mt: 1 }}> */}
      <Box
        sx={{
          gap: 1,
          mt: 1,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {value
          .map((v: string) => JSON.parse(v))
          .map((v: any) => (
            <Chip
              key={v.id}
              label={v.name}
              onDelete={() => handleDelete(v.id)}
            />
          ))}
      </Box>

      {/* </Stack> */}
      {renderFormHelper({ touched, error })}
    </FormControl>
  )
}
