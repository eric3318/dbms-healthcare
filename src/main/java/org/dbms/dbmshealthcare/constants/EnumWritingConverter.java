package org.dbms.dbmshealthcare.constants;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;

@WritingConverter
public class EnumWritingConverter implements Converter<Enum<?>, String> {

  @Override
  public String convert(Enum source) {
    return source.toString();
  }
}
