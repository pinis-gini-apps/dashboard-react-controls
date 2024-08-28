/*
Copyright 2022 Iguazio Systems Ltd.
Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { Field, useField } from 'react-final-form'

const NewChipInput = React.forwardRef(({ name, onChange, onFocus, ...inputProps }, ref) => {
  const { input } = useField(name)

  const handleInputChange = event => {
    input.onChange(event)
    onChange(event)
  }

  const handleInputFocus = event => {
    input.onFocus(event)
    onFocus(event)
  }

  return (
    <Field name={name}>
      {({ input }) => (
        <input
          autoComplete="off"
          data-testid="input"
          ref={ref}
          type="text"
          id={input.name}
          {...{
            ...inputProps,
            ...input
          }}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      )}
    </Field>
  )
})

NewChipInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired
}

export default NewChipInput
