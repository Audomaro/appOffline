USE [appOffline]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 05/13/2016 17:47:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[usuarios](
	[id] [varchar](50) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[clave] [varchar](50) NOT NULL,
	[departamento] [varchar](50) NULL,
	[altaLog] [datetime] NOT NULL,
	[modiLog] [date] NULL,
 CONSTRAINT [PK_usuarios] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
INSERT [dbo].[usuarios] ([id], [nombre], [clave], [departamento], [altaLog], [modiLog]) VALUES (N'00000000-9873-4DBD-A84B-A07BFC993EA8', N'xxx', N'xxx', N'xxx', CAST(0x0000A605005524E0 AS DateTime), NULL)
INSERT [dbo].[usuarios] ([id], [nombre], [clave], [departamento], [altaLog], [modiLog]) VALUES (N'10ACDEAB-9873-4DBD-A84B-A07BFC993EA8', N'Desconocido', N'*.*', N'***.***', CAST(0x0000A60300D63BC0 AS DateTime), NULL)
INSERT [dbo].[usuarios] ([id], [nombre], [clave], [departamento], [altaLog], [modiLog]) VALUES (N'123F5A19-DFB2-4AEA-923B-FCBCC624F48B', N'Roberto', N'Ro12', N'A', CAST(0x0000A60300EF6178 AS DateTime), NULL)
INSERT [dbo].[usuarios] ([id], [nombre], [clave], [departamento], [altaLog], [modiLog]) VALUES (N'153327F1-2C97-4DCD-B574-B449B7E90679', N'Hector', N'Ht45', N'B', CAST(0x0000A60300F094DF AS DateTime), NULL)
INSERT [dbo].[usuarios] ([id], [nombre], [clave], [departamento], [altaLog], [modiLog]) VALUES (N'31ACDEAB-9873-4DBD-A84B-A07BFC993EA8', N'Audomaro', N'j03', N'n/a', CAST(0x0000A60300D33650 AS DateTime), NULL)
INSERT [dbo].[usuarios] ([id], [nombre], [clave], [departamento], [altaLog], [modiLog]) VALUES (N'EAACDEAB-9873-4DBD-A84B-A07BFC993EA8', N'Jose', N'123', N'123', CAST(0x0000A60300000000 AS DateTime), NULL)
