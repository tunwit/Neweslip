import { NextResponse } from "next/server";

export const successResponse = (data: any, message = "OK", status = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
};

export const successPaginationResponse = (data: any,pagination:{page:number,pageSize: number,totalItems: number,totalPages: number,hasNextPage: boolean,hasPrevPage: boolean}, message = "OK", status = 200) => {
  return NextResponse.json(
    {
    success: true,
    message,
    data,
    pagination: pagination
    },
    { status }
  );
};


export const errorResponse = (message = "Something went wrong", status = 500, error?: any) => {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
};