module RedshiftPG
  USER_ERROR_CLASSES = [
    PG::UndefinedTable,
    PG::SyntaxError,
    PG::GroupingError,
    PG::AmbiguousColumn,
    PG::InternalError,
    PG::UndefinedColumn,
    PG::DatatypeMismatch,
    PG::QueryCanceled,
    PG::InternalError,
    PG::NumericValueOutOfRange,
    PG::UndefinedFunction
  ]
end
