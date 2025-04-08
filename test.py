import csv

#   id: number;
#   name: string;
#   nickname: string;
#   email: string;
#   amount: number;
#   status: number;
#   branch: string;
data = [
    {'id': '0001', 'name': 'Thanut Thappota', 'nickname': 'Wit', 'email': 'tunwit2458@gmail.com','amount':'12000','status':1,'branch':'pakkret'},
]

with open('assets/employee.csv', 'w', newline='') as csvfile:
    fieldnames = ['id', 'name', 'nickname', 'email','amount','status','branch']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(data)